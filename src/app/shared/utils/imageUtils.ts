
export class ImageUtils {
    public static toBase64(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result == "string") resolve(reader.result);
                else reject();
            };
            reader.onerror = reject;
        });
    }
}
