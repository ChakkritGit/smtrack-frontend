// serial.d.ts
interface SerialPortFilter {
  usbVendorId?: number;
  usbProductId?: number;
}

interface SerialPortRequestOptions {
  filters: SerialPortFilter[];
}

interface Serial {
  requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
}

interface Navigator {
  serial: Serial;
}

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  readable: ReadableStream;
  writable: WritableStream;
}

interface ReadableStream {
  getReader(): ReadableStreamDefaultReader;
}

interface ReadableStreamDefaultReader {
  read(): Promise<{ value: Uint8Array, done: boolean }>;
  releaseLock(): void;
}
