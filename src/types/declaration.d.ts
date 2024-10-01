declare module 'piexifjs' {
  interface ExifData {
    [key: string]: any;
    "0th"?: { [key: number]: any };
    "1st"?: { [key: number]: any };
    Exif?: { [key: number]: any };
    GPS?: { [key: number]: any };
    Interop?: { [key: number]: any };
    Thumbnail?: string;
  }

  const ImageIFD: {
    Make: number;
    Model: number;
    Orientation: number;
    XResolution: number;
    YResolution: number;
    ResolutionUnit: number;
    Software: number;
    DateTime: number;
    Artist: number;
    Copyright: number;
  };

  const piexif: {
    load: (data: string) => ExifData;
    dump: (data: ExifData) => string;
    insert: (exifStr: string, imageStr: string) => string;
    remove: (imageStr: string) => string;
    ImageIFD: typeof ImageIFD;
  };

  export default piexif;
}
