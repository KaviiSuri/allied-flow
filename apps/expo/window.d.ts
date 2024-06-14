declare global {
  interface window {
    location: {
      origin: string;
    };
  }
}
