export class Function  {
	private readonly name: string;

	constructor(name: string, time?: boolean) {
		this.name = name;
		console.groupCollapsed(name)
		if(time) {
			console.time(name);
		}
	}

	public end() {
		console.timeEnd(this.name);
		console.groupEnd()

	}

	public error = (message?: any, ...optionalParams: any[]) => console.error(message, ...optionalParams)
	public log = (message?: any, ...optionalParams: any[]) => console.log(message, ...optionalParams)

}
