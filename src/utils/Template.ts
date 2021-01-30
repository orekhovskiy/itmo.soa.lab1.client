export class Template {
    private method: String;
    private url: String;
    private bootstrapType: String;

    constructor(method:String, url: String) {
      this.method = method;
      this.url = url;
      this.setBootstrapType(method);
    }
  
    public getUrl(): String {
      return this.url;
    }
    public getMethod(): String {
      return this.method;
    }
    public getBootstrapType(): String {
      return this.bootstrapType;
    }
    public setMethod(method: String): void {
      this.method = method;
      this.setBootstrapType(method);
    }
    public setUrl(url: String): void {
      this.url = url;
    }
    private setBootstrapType(method: String) {
      switch (method) {
        case 'GET':
          this.bootstrapType = 'success';
          break;
        case 'POST':
          this.bootstrapType = 'warning';
          break;
        case 'PUT':
          this.bootstrapType = 'info';
          break;
        case 'DELETE':
          this.bootstrapType = 'danger';
          break;
      }
    }
}