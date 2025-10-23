import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BlogService } from '../../../../core/services/blog/blog.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NewsItem } from '../../../../shared/models/news-item/news-item';
import { createNewsItem } from '../../../../shared/models/data-types';
import { blogCollectionName } from '../../../../secrets';
import { MatSnackBar } from '@angular/material/snack-bar';
import { sanitizeString } from '../../utils';
import {AuthService} from '../../../../core/services/authorization/auth.service';
import {BehaviorSubject, concatMap, Observable, switchMap} from 'rxjs';
import {IEEEuser} from '../../../../shared/models/ieee-user/ieee-user';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import { Timestamp } from '@angular/fire/firestore';
import {NgxImageCompressService} from "ngx-image-compress";
import {ImageUtils} from "../../../../shared/utils/imageUtils";
import {StaticSeoService} from "../../../../core/services/seo/seo-static.service";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-write-news',
    templateUrl: './write-news.component.html',
    styleUrls: ['./write-news.component.css']
})
export class WriteNewsComponent implements OnInit {

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
    localImageBlobs: Map<string, {blob: Blob, extension: string}> = new Map();

    // URLs de imágenes existentes en Firebase (para modo edición)
    existingFirebaseImages: string[] = [];

    // SafeHtml para bypass de sanitización
    safeTextContent: SafeHtml;

    // Configuración de Quill
    quillConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }], // Volver a la configuraci��n original
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
  @ViewChild('quillEditor') quillEditor: any;

  @Input('id') newsReference: string = '';

  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService, private snackBar: MatSnackBar, private authService: AuthService, private imageCompress: NgxImageCompressService, private seoService: StaticSeoService, private sanitizer: DomSanitizer) {
      this.user = {
          fullname: '',
          email: '',
          photoURL: '',
          uID: '',
          roles: []
      };
      this.newsContent = {
          title: '',
          shortIntro: '',
          content: '',
          imageUrl: '',
          author: '',
          reference: '',
          date: this.today,
          imageText: '',
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

      // Validar que newsReference existe y no es undefined antes de hacer la consulta
      if (this.newsReference && this.newsReference.trim() !== '') {
          this.blogService.getDoc(this.newsReference).subscribe(news => {
              if (news) {
                  this.newsContent = news;
                  this.newsContent.reference = this.newsReference;
                  this.newsContent.tags.forEach(tag => this.addTag(tag));
                  // Simplificado: todo el contenido va junto
                  this.textContent = this.newsContent.content;
                  // Cargar imágenes adicionales existentes
                  this.loadExistingImages();
              }
          });
      }
      // No más timeout, usaremos onEditorCreated
  }

  // Configurar el editor Quill cuando se crea (llamado desde el HTML)
  onEditorCreated(quill: any) {
      console.log('Editor Quill creado:', quill);

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

  // Manejar la subida de imagen simplificada - ahora como blob local
  handleImageUpload(file: File, quill: any) {
      const range = quill.getSelection(true);
      if (!range) return;

      // Validar archivo
      const sizeLimit = 10;
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

      // Verificar tamaño del archivo
      if (file.size > 1024 * 1024 * sizeLimit) {
          alert('La imagen es demasiado grande. Máximo 10MB.');
          return;
      }

      try {
          // Crear blob URL local para mostrar la imagen inmediatamente
          const localBlobUrl = URL.createObjectURL(file);
          console.log('Blob URL creada:', localBlobUrl);

          // Verificar que la URL de blob se creó correctamente
          if (!localBlobUrl || localBlobUrl.includes('//:0')) {
              console.error('Error creando blob URL:', localBlobUrl);
              alert('Error procesando la imagen. Intenta de nuevo.');
              return;
          }

          // Guardar el blob para subir más tarde
          this.localImageBlobs.set(localBlobUrl, {
              blob: file,
              extension: type
          });

          // Método más robusto para insertar la imagen
          const currentRange = quill.getSelection(true);
          const insertIndex = currentRange ? currentRange.index : range.index;

          // Crear un elemento img temporal para verificar que funciona
          const tempImg = new Image();
          tempImg.onload = () => {
              console.log('Imagen blob cargada correctamente, insertando en Quill...');

              // Método simplificado y más directo
              try {
                  // Usar insertEmbed directamente con validación adicional
                  console.log('Insertando imagen en índice:', insertIndex);
                  console.log('URL de blob a insertar:', localBlobUrl);

                  // Verificar que Quill tiene foco y está listo
                  quill.focus();

                  // Usar el método más simple y confiable
                  quill.insertEmbed(insertIndex, 'image', localBlobUrl, 'user');

                  // Verificar inmediatamente qué se insertó
                  const insertedContent = quill.getContents();
                  console.log('Contenido Delta después de insertar:', JSON.stringify(insertedContent.ops));

                  // Posicionar cursor después de la imagen
                  quill.setSelection(insertIndex + 1);

                  // Actualizar seguimiento de imágenes
                  if (!this.editorImages.includes(localBlobUrl)) {
                      this.editorImages.push(localBlobUrl);
                  }

                  // Forzar actualización inmediata del contenido
                  setTimeout(() => {
                      this.textContent = quill.root.innerHTML;
                      console.log('HTML después de insertar:', this.textContent);

                      // Verificar si la URL está en el HTML
                      if (this.textContent.includes(localBlobUrl)) {
                          console.log('✅ URL de blob encontrada en el HTML');
                      } else {
                          console.log('❌ URL de blob NO encontrada en el HTML');
                          console.log('Buscando imágenes en el HTML...');
                          const imgTags = this.textContent.match(/<img[^>]*src="[^"]*"[^>]*>/g);
                          console.log('Etiquetas img encontradas:', imgTags);
                      }

                      this.splitContent(this.textContent);

                      // Forzar actualización del ngModel manualmente
                      const event = { html: this.textContent, text: quill.getText(), delta: quill.getContents() };
                      this.updateNewsText(event);

                      // Verificar si necesitamos establecer imagen principal
                      if (!this.selectedMainImageUrl) {
                          this.selectAsMainImage(localBlobUrl);
                      }

                      console.log('Imagen agregada como blob local exitosamente');
                  }, 100);

              } catch (insertError) {
                  console.error('Error al insertar imagen:', insertError);
                  alert('Error insertando la imagen en el editor.');
              }
          };

          tempImg.onerror = () => {
              console.error('Error cargando blob URL como imagen');
              alert('Error procesando la imagen. El archivo podría estar corrupto.');
          };

          // Cargar la imagen blob para verificar que es válida
          tempImg.src = localBlobUrl;

      } catch (error) {
          console.error('Error procesando imagen:', error);
          alert('Error procesando la imagen. Intenta de nuevo.');
      }
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
              switch(alignment) {
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
                      const event = { html: this.textContent, text: quill.getText(), delta: quill.getContents() };
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

                          const event = { html: this.textContent, text: quill.getText(), delta: quill.getContents() };
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

  // Subir imagen desde el editor - ahora como blob local
  uploadImageToEditor(file: File, quill: any) {
      const sizeLimit: number = 10;
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

      // Verificar tamaño del archivo
      if (file.size > 1024 * 1024 * sizeLimit) {
          alert('La imagen es demasiado grande. Máximo 10MB.');
          return;
      }

      // Obtener la posición actual del cursor
      const range = quill.getSelection(true);
      if (!range) return;

      try {
          // Crear blob URL local para mostrar la imagen inmediatamente
          const localBlobUrl = URL.createObjectURL(file);
          console.log('Blob URL creada en uploadImageToEditor:', localBlobUrl);

          // Verificar que la URL de blob se creó correctamente
          if (!localBlobUrl || localBlobUrl.includes('//:0')) {
              console.error('Error creando blob URL:', localBlobUrl);
              alert('Error procesando la imagen. Intenta de nuevo.');
              return;
          }

          // Guardar el blob para subir más tarde
          this.localImageBlobs.set(localBlobUrl, {
              blob: file,
              extension: type
          });

          // Insertar la imagen usando el blob URL local
          quill.insertEmbed(range.index, 'image', localBlobUrl, 'user');
          console.log('Imagen insertada en posición:', range.index);

          // Posicionar el cursor después de la imagen
          quill.setSelection(range.index + 1, 0, 'user');

          // Agregar a la lista de imágenes del editor
          if (!this.editorImages.includes(localBlobUrl)) {
              this.editorImages.push(localBlobUrl);
          }

          // Actualizar el contenido inmediatamente
          this.textContent = quill.root.innerHTML;
          this.splitContent(this.textContent);
          console.log('HTML del editor actualizado');

          // Forzar la detección de cambios de Angular
          const event = { html: this.textContent, text: quill.getText() };
          this.updateNewsText(event);

          // Verificar si necesitamos establecer imagen principal
          if (!this.selectedMainImageUrl) {
              this.selectAsMainImage(localBlobUrl);
          }

          this.error$.next(null);
          console.log('Proceso de inserción completado como blob local exitosamente');
      } catch (error) {
          console.error('Error procesando imagen en uploadImageToEditor:', error);
          this.error$.next("COMPRESSION_FAILED");
          alert('Error procesando la imagen. Intenta de nuevo.');
      }
  }

  // Manejar imágenes pegadas
  handlePastedImage(node: any, delta: any, quill: any) {
      // Si la imagen pegada es una URL externa, la dejamos pasar
      if (node.src && node.src.startsWith('http')) {
          return delta;
      }

      // Para imágenes locales pegadas, podríamos implementar lógica adicional aquí
      return delta;
  }

  // Extraer todas las imágenes del contenido del editor
  extractImagesFromContent(): string[] {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.textContent;
      const images = tempDiv.querySelectorAll('img');
      return Array.from(images).map(img => img.src);
  }

  // Método para limpiar URLs de blob cuando ya no se necesiten
  cleanupBlobUrls() {
      this.localImageBlobs.forEach((_, localUrl) => {
          URL.revokeObjectURL(localUrl);
      });
      this.localImageBlobs.clear();
  }

  // Método para verificar si una URL es de blob local
  isLocalBlobUrl(url: string): boolean {
      return url.startsWith('blob:');
  }

  // Obtener lista de imágenes disponibles para seleccionar como principal
  getAvailableImages(): string[] {
      const contentImages = this.extractImagesFromContent();
      const allImages = [...this.editorImages, ...contentImages];
      return [...new Set(allImages)]; // Eliminar duplicados
  }

  // Seleccionar imagen como principal
  selectAsMainImage(imageUrl: string): void {
      this.selectedMainImageUrl = imageUrl;
      this.newsContent.imageUrl = imageUrl;

      // También actualizar imageUrl y imageType para compatibilidad
      this.imageUrl = imageUrl;
      // Extraer tipo de imagen de la URL (asumiendo que está en el nombre del archivo)
      const urlParts = imageUrl.split('.');
      if (urlParts.length > 1) {
          this.imageType = urlParts[urlParts.length - 1].split('?')[0];
      }
  }

  // Verificar si una imagen es la principal
  isMainImage(imageUrl: string): boolean {
      return this.selectedMainImageUrl === imageUrl || this.newsContent.imageUrl === imageUrl;
  }

  dateFormatted() {
      return this.newsContent.date.toLocaleDateString();
  }

  changePublishDate() {
      if (this.publishNow) {
          this.newsContent.date = this.today;
      } else {
          this.newsContent.date = this.publishDate;
      }
      this.newsContent.listed = this.publishNow;
      // Si el radio button es false, con el ngModel se setea solo this.newsContent.date
  }

  add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      // Add our tag
      if ((value || '').trim()) {
          if (this.allTags.includes(this.sanitizeTag(value.trim()))) {
              this.addTag(value)
          }
      }

      // Reset the input value
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

  currentTags() {
      return Object.keys(this.newsTagMap);
  }

  getAuthorName() {
      if (!this.newsContent.author) {
          return this.user.fullname;
      }
      return this.newsContent.author;
  }

  private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  splitContent(htmlText?: string) {
      let text: string = '';
      if (htmlText) {
          text = htmlText;
      } else {
          text = this.textContent;
      }

      // Simplificado: todo el contenido va a newsContent.content
      this.newsContent.shortIntro = ''; // Ya no se usa
      this.newsContent.content = text;

      // Crear versión sanitizada segura para el preview
      this.safeTextContent = this.sanitizer.bypassSecurityTrustHtml(text);
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

      // Si no hay imagen principal seleccionada pero hay imágenes disponibles, seleccionar la primera
      if (!this.selectedMainImageUrl && uniqueImages.length > 0) {
          this.selectAsMainImage(uniqueImages[0]);
      }

      // Crear versión sanitizada segura
      this.safeTextContent = this.sanitizer.bypassSecurityTrustHtml(this.textContent);

      // Forzar detección de cambios para el preview
      setTimeout(() => {
          // Disparar detección de cambios de Angular
          // Esto asegura que el preview se actualice con las nuevas imágenes
      }, 50);
  }

  // Cargar imágenes adicionales existentes de Firebase Storage
  loadExistingImages() {
      // Validar que existe una referencia válida antes de proceder
      if (this.newsContent.reference && this.newsContent.reference.trim() !== '') {
          this.blogService.getNewsImages(this.newsContent.reference).subscribe(images => {
              // Separar las imágenes existentes de Firebase
              this.existingFirebaseImages = images;
              this.editorImages = [...images]; // Inicializar con las imágenes existentes

              // Si hay una imagen principal establecida, marcarla como seleccionada
              if (this.newsContent.imageUrl) {
                  this.selectedMainImageUrl = this.newsContent.imageUrl;
              }
          });
      }
  }

  submitNews() {
      if (!this.newsReference){
          this.newsContent.author = this.getAuthorName();
          this.newsContent.reference = encodeURIComponent(sanitizeString(this.newsContent.title) + '-' + this.blogService.docsSize.getValue());
          this.newsContent.tags = this.currentTags();
      }

      if (this.newsContent.title !== '') {
          console.log('Iniciando proceso de guardado de noticia...');

          // Paso 1: Subir todas las imágenes locales (blobs) a Firebase Storage
          if (this.localImageBlobs.size > 0) {
              console.log(`Subiendo ${this.localImageBlobs.size} imágenes locales...`);

              this.blogService.uploadMultipleBlobImages(this.localImageBlobs, this.newsContent.reference)
                  .pipe(
                      concatMap((urlMap: Map<string, string>) => {
                          console.log('Imágenes subidas exitosamente:', urlMap);

                          // Reemplazar URLs locales por URLs de Firebase en el contenido
                          let updatedContent = this.newsContent.content;
                          let updatedMainImageUrl = this.selectedMainImageUrl;

                          urlMap.forEach((firebaseUrl, localUrl) => {
                              // Reemplazar en el contenido HTML
                              updatedContent = updatedContent.replace(new RegExp(localUrl, 'g'), firebaseUrl);

                              // Reemplazar en la imagen principal si corresponde
                              if (updatedMainImageUrl === localUrl) {
                                  updatedMainImageUrl = firebaseUrl;
                              }
                          });

                          // Actualizar el contenido de la noticia
                          this.newsContent.content = updatedContent;

                          // Determinar imagen principal final
                          if (!updatedMainImageUrl || updatedMainImageUrl.startsWith('blob:')) {
                              const contentImages = this.extractImagesFromContent();
                              updatedMainImageUrl = contentImages.length > 0 ? contentImages[0] : '';
                          }

                          console.log('Contenido actualizado con URLs de Firebase');
                          console.log('Imagen principal final:', updatedMainImageUrl);

                          // Paso 2: Limpiar imágenes no utilizadas de Firebase Storage
                          return this.blogService.cleanUnusedImages(
                              this.newsContent.reference,
                              this.newsContent.content,
                              updatedMainImageUrl
                          ).pipe(
                              concatMap(() => {
                                  console.log('Imágenes no utilizadas limpiadas');

                                  // Paso 3: Guardar la noticia en Firestore
                                  return this.blogService.setDoc({
                                      ...this.newsContent,
                                      imageUrl: updatedMainImageUrl,
                                      shortIntro: '' // Siempre vacío ahora
                                  });
                              })
                          );
                      })
                  )
                  .subscribe({
                      next: (sent) => {
                          if (sent) {
                              console.log('Noticia guardada exitosamente');

                              // Limpiar URLs de blob locales para evitar memory leaks
                              this.localImageBlobs.forEach((_, localUrl) => {
                                  URL.revokeObjectURL(localUrl);
                              });
                              this.localImageBlobs.clear();

                              this.router.navigate([`/noticias/${this.newsContent.reference}`]);
                          } else {
                              console.error('Error al guardar la noticia');
                              alert('Error al guardar la noticia. Intenta de nuevo.');
                          }
                      },
                      error: (error) => {
                          console.error('Error en el proceso de guardado:', error);
                          alert('Error al guardar la noticia. Intenta de nuevo.');
                      }
                  });
          } else {
              // Si no hay imágenes locales, proceder con la l��gica original
              console.log('No hay imágenes locales, procediendo con l��gica estándar...');

              // Determinar imagen principal
              let mainImageUrl = this.selectedMainImageUrl;
              if (!mainImageUrl) {
                  const contentImages = this.extractImagesFromContent();
                  mainImageUrl = contentImages.length > 0 ? contentImages[0] : '';
              }

              // Limpiar imágenes no utilizadas y guardar
              this.blogService.cleanUnusedImages(
                  this.newsContent.reference,
                  this.newsContent.content,
                  mainImageUrl
              ).pipe(
                  concatMap(() =>
                      this.blogService.setDoc({
                          ...this.newsContent,
                          imageUrl: mainImageUrl,
                          shortIntro: ''
                      })
                  )
              ).subscribe(sent => {
                  if (sent) {
                      this.router.navigate([`/noticias/${this.newsContent.reference}`]);
                  }
              });
          }
      } else {
          // Si no hay título, eliminar la noticia
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

}
