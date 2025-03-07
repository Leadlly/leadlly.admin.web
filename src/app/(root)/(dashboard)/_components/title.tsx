interface title{
    title:string
}
export default async function Title({title}:title) {
    return(<div>
        <h1 className="text-4xl p-4 m-3 font-sarif">{title}</h1>
    </div>)
}
export  async function SmallTitle({title}:title){
    return (
        <div className="text-2xl p-2 m-2 font-sarif">
           {title}
        </div>
    )
}