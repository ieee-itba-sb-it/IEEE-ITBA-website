import {Category} from "./category";

export type Encounter = {
    id: string
    level: number
    order: number
    category: Category
    robot1: string
    robot2: string
    winner?: number
}
