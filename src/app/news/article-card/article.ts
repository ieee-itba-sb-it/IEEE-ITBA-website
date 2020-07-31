export class article{
    tags: string[];
    title: string;
    desc: string;
    date: string;

    constructor(Tags: string[], Title: string, Desc: string, Date: string) {
        this.tags=Tags;
        this.title=Title;
        this.desc=Desc;
        this.date=Date;
    }
}