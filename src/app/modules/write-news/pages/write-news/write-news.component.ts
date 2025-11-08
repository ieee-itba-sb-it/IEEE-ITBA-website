import {Component, ElementRef, Input, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NewsItem } from '../../../../shared/models/news-item/news-item';
import { blogCollectionName } from '../../../../secrets';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sanitizeString } from '../../utils';
import {AuthService} from '../../../../core/services/authorization/auth.service';
import {BehaviorSubject, concatMap, Observable} from 'rxjs';
import {IEEEuser} from '../../../../shared/models/ieee-user/ieee-user';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-write-news',
    templateUrl: './write-news.component.html',
    styleUrls: ['./write-news.component.css']
})
export class WriteNewsComponent implements OnInit, OnDestroy {

    editorForm: FormGroup;
    user: IEEEuser;
    durationInSeconds = 5;
    newsContent: NewsItem;
    textContent = '';
    today = Timestamp.now().toDate();
    minDate = Timestamp.now().toDate();
    publishDate = new Date(this.minDate);
    publishNow = true;
    maxTags = 3;

    // Upload image
    imageUrl: string;
    imageType: string;
    error$ = new BehaviorSubject<string>(null)

    // Imágenes del editor - ahora manejamos blobs locales
    editorImages: string[] = []; // URLs locales (blob URLs)
    selectedMainImageUrl: string = '';

    // Mapa de blobs locales para subir al final
    localImageBlobs: Map<string, { blob: Blob, extension: string }> = new Map();

    // URLs de imágenes existentes en Firebase (para modo edición)
    existingFirebaseImages: string[] = [];

    // SafeHtml para bypass de sanitización
    safeTextContent: SafeHtml;

    // Configuración de Quill
    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}],
            [{'indent': '-1'}, {'indent': '+1'}],
            [{'direction': 'rtl'}],
            [{'size': ['small', false, 'large', 'huge']}],
            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'color': []}, {'background': []}],
            [{'font': []}],
            [{'align': []}], // Volver a la configuración original
            ['clean'],
            ['link', 'image', 'video']
        ]
    };

    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    tagControl = new FormControl();
    filteredTags: Observable<string[]>;

    allTags: string[] = [];
    newsTagMap = {};

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    @Input() newsReference: string = '';

    constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService, private snackBar: MatSnackBar, private authService: AuthService, private seoService: StaticSeoService, private sanitizer: DomSanitizer) {
        this.user = {
            fullname: '',
            email: '',
            photoURL: '',
            uID: '',
            roles: []
        };
        this.newsContent = {
            title: '',
            content: '',
            imageUrl: '',
            author: '',
            reference: '',
            date: this.today,
            listed: true,
            tags: [],
            ratings: [0, 0, 0, 0, 0],
        };
        this.filteredTags = this.tagControl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice())
        );
        this.blogService.setCollectionName(blogCollectionName);
        this.blogService.getDocsTagsAsObservable().subscribe((tags: string[]) => {
            this.allTags = tags;
        });
        this.editorForm = new FormGroup({
            editor: new FormControl(null)
        });
        this.authService.getCurrentUser().subscribe((value: IEEEuser) => {
            if (value != null) {
                this.user = value;
            }
        });
        // Programmed date must be at least tomorrow
        this.minDate.setDate(this.minDate.getDate() + 1);
        this.publishDate = new Date(this.minDate);
        this.blogService.retrieveDocsSize();
    }

    ngOnInit() {
        this.seoService.updateMetaTags('WRITE-NEW.PAGETITLE', 'WRITE-NEW.PAGEDESCRIPTION', ['NEWS', 'IEEE', 'ITBA']);

        // Suscribirse a cambios de ruta para modo edición
        this.route.paramMap.subscribe(params => {
            const routeId = params.get('id');
            if (routeId) {
                this.newsReference = decodeURIComponent(routeId);
            }

            if (this.newsReference && this.newsReference.trim() !== '') {
                this.blogService.getDoc(this.newsReference).subscribe(news => {
                    if (news) {
                        // Cargar datos existentes
                        this.newsContent = news;
                        this.newsContent.reference = this.newsReference;

                        // Tags
                        this.newsTagMap = {};
                        this.newsContent.tags.forEach(tag => this.addTag(tag));

                        // Contenido y preview inicial
                        this.textContent = this.newsContent.content || '';
                        this.splitContent(this.textContent);

                        // Imagen principal
                        this.selectedMainImageUrl = this.newsContent.imageUrl || '';

                        // Cargar imágenes adicionales existentes
                        this.loadExistingImages();
                    }
                });
            }
        });
    }

    // Configurar el editor Quill cuando se crea (llamado desde el HTML)
    onEditorCreated(quill: any) {
        console.log('Editor Quill creado:', quill);

        // Parchear sanitizador de Quill para permitir blob: y data:image/* en imágenes
        try {
            const Q = quill.constructor; // referencia a Quill
            const ImageFormat = Q.import('formats/image');
            const LinkFormat = Q.import('formats/link');
            const baseSanitize = LinkFormat && LinkFormat.sanitize ? LinkFormat.sanitize.bind(LinkFormat) : (url => url);
            ImageFormat.sanitize = (url: string) => {
                if (!url) { return url; }
                if (/^blob:/i.test(url) || /^data:image\//i.test(url)) {
                    return url; // permitir blob y data:image
                }
                // permitir http/https usando el sanitizador base de Quill
                return baseSanitize(url);
            };
        } catch (e) {
            console.warn('No se pudo parchear el sanitizador de Quill:', e);
        }

        // En lugar de interceptar completamente, vamos a personalizar solo la subida
        this.setupImageUploadHandler(quill);

        // Agregar botones personalizados
        this.addImageResizeButtons(quill);

        // Detectar cuando se pegan imágenes
        quill.clipboard.addMatcher('IMG', (node, delta) => {
            return this.handlePastedImage(node, delta, quill);
        });
    }

    // Configurar el manejador de subida de imágenes personalizado
    setupImageUploadHandler(quill: any) {
        // Obtener el módulo de toolbar
        const toolbar = quill.getModule('toolbar');

        // Interceptar solo cuando el usuario hace clic en el botón de imagen
        toolbar.addHandler('image', () => {
            // Crear input de archivo
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = () => {
                const file = input.files?.[0];
                if (file) {
                    // Subir el archivo y luego insertar la URL en Quill
                    this.handleImageUpload(file, quill);
                }
            };
        });
    }

    // Manejar la subida de imagen simplificada
    handleImageUpload(file: File, quill: any) {
        const range = quill.getSelection(true);
        if (!range) return;

        // Validar archivo
        const type = file.type.split('/')[1];
        const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'];

        if (file.type.split('/')[0] !== 'image') {
            alert('Por favor selecciona un archivo de imagen válido.');
            return;
        }
        if (!extensions.includes(type)) {
            alert('Formato de imagen no soportado. Usa: PNG, JPG, JPEG, WEBP, GIF o BMP.');
            return;
        }

        // Insertar localmente como blob URL y postergar subida hasta guardar
        const blobUrl = URL.createObjectURL(file);
        this.localImageBlobs.set(blobUrl, {blob: file, extension: type});

        // Insertar la imagen en la posición del cursor
        quill.insertEmbed(range.index, 'image', blobUrl);
        quill.setSelection(range.index + 1);

        // Actualizar seguimiento de imágenes y contenido
        if (!this.editorImages.includes(blobUrl)) {
            this.editorImages.push(blobUrl);
        }
        this.textContent = quill.root.innerHTML;
        this.splitContent(this.textContent);

        const event = {html: this.textContent, text: quill.getText(), delta: quill.getContents()};
        this.updateNewsText(event);

        // Establecer imagen principal si no hay
        if (!this.selectedMainImageUrl) {
            this.selectAsMainImage(blobUrl);
        }

        console.log('Imagen insertada localmente (blob):', blobUrl);
    }

    // Función para alinear imágenes específicamente
    alignImage(quill: any, index: number, alignment: string) {
        const [blot] = quill.getLeaf(index);
        if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
            const img = blot.domNode;

            // Remover clases de alineación anteriores
            img.classList.remove('ql-align-center', 'ql-align-right', 'ql-align-left', 'ql-align-justify');

            // Aplicar nueva alineación
            if (alignment) {
                img.classList.add(`ql-align-${alignment}`);
                // También aplicar el estilo directamente para asegurar que funcione
                switch (alignment) {
                case 'center':
                    img.style.display = 'block';
                    img.style.marginLeft = 'auto';
                    img.style.marginRight = 'auto';
                    break;
                case 'right':
                    img.style.display = 'block';
                    img.style.marginLeft = 'auto';
                    img.style.marginRight = '0';
                    break;
                case 'left':
                    img.style.display = 'block';
                    img.style.marginLeft = '0';
                    img.style.marginRight = 'auto';
                    break;
                default:
                    img.style.display = '';
                    img.style.marginLeft = '';
                    img.style.marginRight = '';
                }
            }

            // Actualizar el contenido
            this.textContent = quill.root.innerHTML;
            this.splitContent(this.textContent);
        }
    }

    // Agregar botones para redimensionar imágenes
    addImageResizeButtons(quill: any) {
        const toolbar = quill.getModule('toolbar');
        const toolbarContainer = toolbar.container;

        // Verificar si ya existe el botón
        if (toolbarContainer.querySelector('.ql-image-resize')) {
            return;
        }

        // Crear contenedor para el botón de imagen
        const imageButtonsContainer = document.createElement('span');
        imageButtonsContainer.className = 'ql-formats';
        imageButtonsContainer.style.marginLeft = '5px';

        // Botón para redimensionar imagen con porcentaje personalizado
        const resizeButton = document.createElement('button');
        resizeButton.innerHTML = '📏';
        resizeButton.title = 'Redimensionar imagen (%)';
        resizeButton.className = 'ql-image-resize';
        resizeButton.type = 'button';
        this.styleImageButton(resizeButton);

        // Evento para el botón de redimensionar
        resizeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.resizeSelectedImageByPercentage(quill);
        });

        // Agregar botón al contenedor
        imageButtonsContainer.appendChild(resizeButton);

        // Agregar el contenedor al toolbar
        toolbarContainer.appendChild(imageButtonsContainer);
        console.log('Botón de redimensionar imagen agregado');
    }

    // Estilizar botones de imagen
    styleImageButton(button: HTMLElement) {
        button.style.padding = '5px 8px';
        button.style.fontSize = '12px';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '3px';
        button.style.background = '#f8f9fa';
        button.style.cursor = 'pointer';
        button.style.marginRight = '2px';
    }

    // Redimensionar imagen seleccionada
    resizeSelectedImage(quill: any, width: number) {
        const range = quill.getSelection();
        if (range) {
            const [blot] = quill.getLeaf(range.index);
            if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
                const img = blot.domNode;

                // Aplicar el nuevo tamaño
                img.style.width = `${width}px`;
                img.style.height = 'auto';
                img.style.maxWidth = '100%'; // Mantener responsividad

                // Actualizar contenido
                this.textContent = quill.root.innerHTML;
                this.splitContent(this.textContent);

                console.log(`Imagen redimensionada a ${width}px`);
            } else {
                alert('Por favor, selecciona una imagen primero haciendo clic en ella.');
            }
        } else {
            alert('Por favor, selecciona una imagen primero haciendo clic en ella.');
        }
    }

    // Redimensionar imagen seleccionada por porcentaje
    resizeSelectedImageByPercentage(quill: any) {
        const range = quill.getSelection();
        console.log('Rango seleccionado:', range);

        if (range) {
            // Intentar obtener la imagen en la posición del cursor
            let imageIndex = -1;

            // Método 1: Buscar la imagen en la posición exacta
            const [blot] = quill.getLeaf(range.index);
            if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
                imageIndex = range.index;
            } else {
                // Método 2: Buscar imagen antes del cursor
                if (range.index > 0) {
                    const [prevBlot] = quill.getLeaf(range.index - 1);
                    if (prevBlot && prevBlot.domNode && prevBlot.domNode.tagName === 'IMG') {
                        imageIndex = range.index - 1;
                    }
                }
            }

            // Método 3: Si no encontramos imagen, buscar en el contenido del editor
            if (imageIndex === -1) {
                const editorContent = quill.root;
                const allImages = editorContent.querySelectorAll('img');

                if (allImages.length === 1) {
                    // Si solo hay una imagen, encontrar su índice en el delta
                    const delta = quill.getContents();
                    for (let i = 0; i < delta.ops.length; i++) {
                        if (delta.ops[i].insert && delta.ops[i].insert.image) {
                            let currentIndex = 0;
                            for (let j = 0; j < i; j++) {
                                if (typeof delta.ops[j].insert === 'string') {
                                    currentIndex += delta.ops[j].insert.length;
                                } else {
                                    currentIndex += 1;
                                }
                            }
                            imageIndex = currentIndex;
                            break;
                        }
                    }
                    console.log('Se encontró una sola imagen en índice:', imageIndex);
                } else if (allImages.length > 1) {
                    // Si hay múltiples imágenes, mostrar mensaje más específico
                    alert('Por favor, haz clic directamente sobre la imagen que quieres redimensionar, luego presiona el botón de redimensionar.');
                    return;
                }
            }

            if (imageIndex >= 0) {
                console.log('Imagen encontrada en índice:', imageIndex);

                // Solicitar porcentaje al usuario
                const percentageInput = prompt('Ingrese el porcentaje del tamaño original (ejemplo: 50, 100, 150):');

                if (percentageInput !== null && percentageInput.trim() !== '') {
                    const percentage = parseFloat(percentageInput);

                    if (isNaN(percentage) || percentage <= 0) {
                        alert('Por favor, ingrese un porcentaje válido mayor a 0.');
                        return;
                    }

                    // Usar el API de Quill para formatear la imagen
                    quill.formatText(imageIndex, 1, {
                        'width': `${percentage}%`,
                        'height': 'auto',
                        'max-width': '100%'
                    });

                    // También aplicar directamente al elemento DOM como respaldo
                    const [blot] = quill.getLeaf(imageIndex);
                    if (blot && blot.domNode && blot.domNode.tagName === 'IMG') {
                        const img = blot.domNode;

                        // Crear un estilo con !important para sobrescribir cualquier CSS
                        const styleText = `width: ${percentage}% !important; height: auto !important; max-width: 100% !important;`;
                        img.setAttribute('style', styleText);

                        console.log(`Estilo aplicado: ${styleText}`);
                    }

                    // Actualizar contenido
                    setTimeout(() => {
                        this.textContent = quill.root.innerHTML;
                        this.splitContent(this.textContent);

                        // Forzar actualización del modelo
                        const event = {html: this.textContent, text: quill.getText(), delta: quill.getContents()};
                        this.updateNewsText(event);

                        console.log(`Imagen redimensionada al ${percentage}% del tamaño original`);
                    }, 100);
                }
            } else {
                alert('No se encontró ninguna imagen. Por favor, haz clic directamente sobre la imagen que quieres redimensionar antes de usar este botón.');
            }
        } else {
            // Si no hay selección, intentar encontrar imagen por otros métodos
            const editorContent = quill.root;
            const allImages = editorContent.querySelectorAll('img');

            if (allImages.length === 1) {
                // Si solo hay una imagen, procesarla directamente
                console.log('Procesando imagen única encontrada sin selección');

                const percentageInput = prompt('Ingrese el porcentaje del tamaño original (ejemplo: 50, 100, 150):');

                if (percentageInput !== null && percentageInput.trim() !== '') {
                    const percentage = parseFloat(percentageInput);

                    if (isNaN(percentage) || percentage <= 0) {
                        alert('Por favor, ingrese un porcentaje válido mayor a 0.');
                        return;
                    }

                    // Encontrar el índice de la imagen en el delta
                    const delta = quill.getContents();
                    let imageIndex = -1;
                    let currentIndex = 0;

                    for (let i = 0; i < delta.ops.length; i++) {
                        if (delta.ops[i].insert && delta.ops[i].insert.image) {
                            imageIndex = currentIndex;
                            break;
                        }
                        if (typeof delta.ops[i].insert === 'string') {
                            currentIndex += delta.ops[i].insert.length;
                        } else {
                            currentIndex += 1;
                        }
                    }

                    if (imageIndex >= 0) {
                        // Aplicar formato usando Quill API
                        quill.formatText(imageIndex, 1, {
                            'width': `${percentage}%`,
                            'height': 'auto',
                            'max-width': '100%'
                        });

                        // Aplicar también directamente al DOM
                        const img = allImages[0];
                        const styleText = `width: ${percentage}% !important; height: auto !important; max-width: 100% !important;`;
                        img.setAttribute('style', styleText);

                        setTimeout(() => {
                            this.textContent = quill.root.innerHTML;
                            this.splitContent(this.textContent);

                            const event = {html: this.textContent, text: quill.getText(), delta: quill.getContents()};
                            this.updateNewsText(event);

                            console.log(`Imagen redimensionada al ${percentage}% del tamaño original`);
                        }, 100);
                    }
                }
            } else {
                alert('Por favor, haz clic primero en el editor y luego selecciona una imagen.');
            }
        }
    }

    // Seleccionar imagen local para subir
    selectLocalImage(quill: any) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/webp');
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                this.uploadImageToEditor(file, quill);
            }
        };
    }

    // Subir imagen desde el editor (uso local hasta guardar)
    uploadImageToEditor(file: File, quill: any) {
        const extensions: string[] = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'];
        const type: string = file.type.split('/')[1];

        if (file.type.split('/')[0] !== 'image') {
            this.error$.next("FILE_TYPE");
            return;
        }
        if (!extensions.includes(type)) {
            this.error$.next("FILE_EXTENSION");
            return;
        }

        const range = quill.getSelection(true);
        if (!range) return;

        const blobUrl = URL.createObjectURL(file);
        this.localImageBlobs.set(blobUrl, {blob: file, extension: type});

        quill.insertEmbed(range.index, 'image', blobUrl, 'user');
        quill.setSelection(range.index + 1, 0, 'user');

        if (!this.editorImages.includes(blobUrl)) {
            this.editorImages.push(blobUrl);
        }

        this.textContent = quill.root.innerHTML;
        this.splitContent(this.textContent);

        const event = {html: this.textContent, text: quill.getText()};
        this.updateNewsText(event);

        this.error$.next(null);
        console.log('Imagen insertada localmente (blob) desde editor:', blobUrl);
    }

    // Manejar imágenes pegadas
    handlePastedImage(node: any, delta: any, _quill: any) {
        // Si la imagen pegada es una URL externa, la dejamos pasar
        if (node.src && node.src.startsWith('http')) {
            return delta;
        }

        // Convertir data URI a blob URL y gestionarla localmente
        if (node.src && node.src.startsWith('data:')) {
            try {
                const mime = (node.src.substring(5, node.src.indexOf(';')) || 'image/png').split('/')[1];
                const byteString = atob(node.src.split(',')[1]);
                const arrayBuffer = new ArrayBuffer(byteString.length);
                const intArray = new Uint8Array(arrayBuffer);
                for (let i = 0; i < byteString.length; i++) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([intArray], {type: `image/${mime}`});
                const blobUrl = URL.createObjectURL(blob);
                this.localImageBlobs.set(blobUrl, {blob, extension: mime});

                // Reemplazar el src en el delta por el blobUrl
                if (delta && delta.ops) {
                    delta.ops.forEach(op => {
                        if (op.insert && op.insert.image) {
                            op.insert.image = blobUrl;
                        }
                    });
                    // Registrar en editorImages
                    if (!this.editorImages.includes(blobUrl)) {
                        this.editorImages.push(blobUrl);
                    }
                    return delta;
                }
            } catch (e) {
                console.error('Error procesando imagen pegada:', e);
                return delta;
            }
        }

        // Para otros casos (blob:, etc.) mantener por defecto
        return delta;
    }


    // Extraer todas las imágenes del contenido del editor
    extractImagesFromContent(): string[] {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.textContent;
        const images = tempDiv.querySelectorAll('img');
        return Array.from(images).map(img => img.src);
    }

    // Extraer imágenes desde un HTML arbitrario (para procesamiento previo al guardado)
    private extractImagesFromHtml(html: string): string[] {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html || '';
        const images = tempDiv.querySelectorAll('img');
        return Array.from(images).map((img: any) => img.src);
    }

    // Convertir Blob a base64
    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Reemplazar imágenes locales por URLs de Storage al guardar
    private async replaceLocalImagesWithUploaded(contentHtml: string, mainImageUrl: string): Promise<{
        updatedContent: string,
        updatedMainImageUrl: string
    }> {
        let updatedContent = contentHtml || '';
        let updatedMain = mainImageUrl || '';

        const srcs = this.extractImagesFromHtml(updatedContent);
        const reference = this.newsContent.reference || `temp_${Date.now()}`;

        for (const src of srcs) {
            try {
                if (src.startsWith('blob:')) {
                    const entry = this.localImageBlobs.get(src);
                    if (!entry) continue;
                    const base64 = await this.blobToBase64(entry.blob);
                    const url = await this.blogService.uploadAdditionalImage(base64, entry.extension, reference).toPromise();
                    updatedContent = updatedContent.split(src).join(url);
                    if (updatedMain === src) {
                        updatedMain = url;
                    }
                } else if (src.startsWith('data:')) {
                    // data:image/<ext>;base64,XXXXX
                    const mime = (src.substring(5, src.indexOf(';')) || 'image/png').split('/')[1];
                    const url = await this.blogService.uploadAdditionalImage(src, mime, reference).toPromise();
                    updatedContent = updatedContent.split(src).join(url);
                    if (updatedMain === src) {
                        updatedMain = url;
                    }
                }
            } catch (e) {
                console.error('Error subiendo imagen local:', e);
            }
        }

        return {updatedContent, updatedMainImageUrl: updatedMain};
    }

    submitNews() {
        if (!this.newsReference) {
            this.newsContent.author = this.getAuthorName();
            this.newsContent.reference = encodeURIComponent(sanitizeString(this.newsContent.title) + '-' + this.blogService.docsSize.getValue());
            this.newsContent.tags = this.currentTags();
        }

        if (this.newsContent.title !== '') {
            // Determinar imagen principal - puede ser local (blob) y se actualizará tras subir
            let mainImageUrl = this.selectedMainImageUrl;
            if (!mainImageUrl) {
                const contentImages = this.extractImagesFromContent();
                mainImageUrl = contentImages.length > 0 ? contentImages[0] : '';
            }

            // Procesar imágenes locales primero, reemplazándolas por URLs del storage
            (async () => {
                const {
                    updatedContent,
                    updatedMainImageUrl
                } = await this.replaceLocalImagesWithUploaded(this.newsContent.content, mainImageUrl);
                this.newsContent.content = updatedContent;
                mainImageUrl = updatedMainImageUrl;

                // Crear el contenido completo para analizar imágenes usadas
                const fullContent = this.newsContent.content;

                // Limpiar imágenes no utilizadas y guardar
                this.blogService.cleanUnusedImages(
                    this.newsContent.reference,
                    fullContent,
                    mainImageUrl
                ).pipe(
                    concatMap(() =>
                        this.blogService.setDoc({
                            ...this.newsContent,
                            imageUrl: mainImageUrl
                        })
                    )
                ).subscribe(sent => {
                    if (sent) {
                        // Resetear cache local
                        this.localImageBlobs.clear();
                        this.router.navigate([`/noticias/${this.newsContent.reference}`]);
                    }
                });
            })();
        } else {
            this.blogService.deleteDoc(this.newsContent.reference).subscribe(sent => {
                if (sent) {
                    this.router.navigate([`/noticias`]);
                }
            });
        }
    }

    openSnackBar() {
        this.snackBar.open('No se pudo subir la noticia', 'Cerrar', {
            duration: this.durationInSeconds * 1000,
        });
    }

    updateNewsText($event) {
        // Restaurar el funcionamiento original
        this.textContent = $event.html;
        this.splitContent($event.html);

        // Actualizar inmediatamente la lista de imágenes disponibles cuando cambia el contenido
        const contentImages = this.extractImagesFromContent();

        // Combinar con imágenes ya subidas
        const allImages = [...this.editorImages, ...contentImages];
        const uniqueImages = [...new Set(allImages)];

        // Revocar y limpiar blob URLs que ya no están presentes en el contenido
        const currentSet = new Set(uniqueImages);
        Array.from(this.localImageBlobs.keys()).forEach((blobUrl) => {
            if (!currentSet.has(blobUrl)) {
                try {
                    URL.revokeObjectURL(blobUrl);
                } catch {
                }
                this.localImageBlobs.delete(blobUrl);
            }
        });

        // Si no hay imagen principal seleccionada pero hay imágenes disponibles, seleccionar la primera
        if (!this.selectedMainImageUrl && uniqueImages.length > 0) {
            this.selectAsMainImage(uniqueImages[0]);
        }

        // Crear versión sanitizada segura
        this.safeTextContent = this.sanitizer.bypassSecurityTrustHtml(this.textContent);

        // Forzar detección de cambios para el preview
        setTimeout(() => {
            // Disparar detección de cambios de Angular
        }, 50);
    }

    ngOnDestroy(): void {
        // Revocar todos los ObjectURL creados y limpiar el mapa
        for (const blobUrl of Array.from(this.localImageBlobs.keys())) {
            try {
                URL.revokeObjectURL(blobUrl);
            } catch {
            }
        }
        this.localImageBlobs.clear();
    }

    // Utilidades de tags
    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            if (this.allTags.includes(this.sanitizeTag(value.trim()))) {
                this.addTag(value);
            }
        }

        if (input) {
            input.value = '';
        }

        this.tagControl.setValue(null);
    }

    addTag(tag: string) {
        this.newsTagMap[this.sanitizeTag(tag)] = true;
    }

    remove(tag: string): void {
        delete this.newsTagMap[this.sanitizeTag(tag)];
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.newsTagMap[this.sanitizeTag(event.option.viewValue)] = true;
        this.tagInput.nativeElement.value = '';
        this.tagControl.setValue(null);
    }

    sanitizeTag(toSanitize: string) {
        return toSanitize.charAt(0).toUpperCase() + toSanitize.slice(1).toLowerCase();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
    }

    currentTags() {
        return Object.keys(this.newsTagMap);
    }

    getAuthorName() {
        if (!this.newsContent.author) {
            return this.user.fullname;
        }
        return this.newsContent.author;
    }

    // Contenido y sanitización
    splitContent(htmlText?: string) {
        let text: string = '';
        if (htmlText) {
            text = htmlText;
        } else {
            text = this.textContent;
        }

        this.newsContent.content = text;

        this.safeTextContent = this.sanitizer.bypassSecurityTrustHtml(text);
    }

    // Imágenes en contenido
    getAvailableImages(): string[] {
        const contentImages = this.extractImagesFromContent();
        const allImages = [...this.editorImages, ...contentImages];
        return [...new Set(allImages)];
    }

    selectAsMainImage(imageUrl: string): void {
        this.selectedMainImageUrl = imageUrl;
        this.newsContent.imageUrl = imageUrl;
    }

    isMainImage(imageUrl: string): boolean {
        return this.selectedMainImageUrl === imageUrl || this.newsContent.imageUrl === imageUrl;
    }

    // Cargar imágenes adicionales existentes desde storage (modo edición)
    loadExistingImages() {
        if (this.newsContent.reference && this.newsContent.reference.trim() !== '') {
            this.blogService.getNewsImages(this.newsContent.reference).subscribe(images => {
                this.editorImages = images;
                if (this.newsContent.imageUrl) {
                    this.selectedMainImageUrl = this.newsContent.imageUrl;
                }
            });
        }
    }

}
