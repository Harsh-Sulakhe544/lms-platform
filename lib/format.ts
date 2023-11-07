// i want a dolar symbol to be dsiplayed when i add a course for money 
export const formatPrice = (price:number) => {
    return new Intl.NumberFormat("en-US", {
        style:"currency",
        currency:"USD"
    }).format(price)
}