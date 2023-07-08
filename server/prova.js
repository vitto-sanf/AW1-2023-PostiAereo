"use strict"
const reservation = [{
    
    booked : "1A,1B"
},
{
    booked : "2A,2B"   
}
]

const seat = ["1A" , "3C", "2A","4D"]
const notAvailable= []
for (let i = 0; i < seat.length; i++) {
    
    for (let j = 0; j < reservation.length; j++) {
        
        if(reservation[j].booked.includes(seat[i])){
            notAvailable.push(seat[i])
        }
        
    }
    
}

console.log(notAvailable)
