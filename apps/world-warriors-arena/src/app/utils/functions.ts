export function removeFromArray(array: Array<any>, lambda: (arrayItem: any) => boolean) {
 return array.filter(item => {
    return !lambda(item) 
  })
}