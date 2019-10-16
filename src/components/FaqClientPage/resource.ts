class Resource {
	readyPromise:any;
  constructor() {
    // this.ready();
  }
  ready(scriptPackage: any) {
    if (!this.readyPromise) {
					this.readyPromise = scriptPackage;
    }
    return this.readyPromise;
  }
}

const resource = new Resource();

export default resource;
