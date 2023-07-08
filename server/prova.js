"use strict"
const reservation = [{
    
    booked : "14A,1B"
},
{
    booked : "2A,2B"   
}
]

const seat = ["4A" , "3C", "2A","4D"]
const notAvailable= []

seat.forEach((seat)=>{
    for (let i = 0; i < reservation.length; i++) {
        const reservationSeats = reservation[i].booked.split(',')
        for (let j = 0; j < reservationSeats.length; j++) {
            
            if(reservationSeats[j]=== seat){
                notAvailable.push(seat)
            }
            
        }
       
        
    }
})
/* for (let i = 0; i < seat.length; i++) {
    
    for (let j = 0; j < reservation.length; j++) {
        console.log(seat[i], reservation[j])
        if(reservation[j].booked.includes(seat[i])){
            notAvailable.push(seat[i])
        }
        
    }
    
} */

console.log(notAvailable)
