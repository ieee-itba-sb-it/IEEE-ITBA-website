import {Category} from "./category";

export type Score = {
    uID: string
    fullname: string
    score: number
}

export type Prediction = {
    id: string
    uID: string
    fullname: string
    level: number
    order: number
    category: Category
    winner: string
}
