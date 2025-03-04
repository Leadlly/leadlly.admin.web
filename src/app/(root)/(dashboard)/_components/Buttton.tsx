import Penicon from "./icons/penicon"

export default function Button() {
    return(
        <div className="flex items-center justify-center bg-purple-500 text-xl px-8 py-2  m-3 rounded-lg text-white font-mono gap-2 h-11">
            <Penicon />
            <button>Edit</button>
        </div>
    )
}