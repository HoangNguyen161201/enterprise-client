import { IColumn } from "models/elementType"


export default function column ({title, dataIndex, key}:IColumn) {
    if(!dataIndex && !key) return {
        title: title,
        dataIndex: title,
        key: title
    }
    return {
        title,
        dataIndex,
        key
    }
}