const express = require("express")
const { response } = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT||3000
const {services} = require("./services")
//const { default: services } = require("./services")


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))



/*app.get('/quiz/:id',(request, response) => {
    let found = quizzesdata.questions["Quiz"+request.params.id]
    response.json(found)
})
*/
app.post('/place', (request, response) => {
    console.log("place:", request.body)
    services.addupdatebusiness(request.body)  
    //console.log("Update scores:", scores)
    response.json({message: 'Place update'})

})
app.get('/places',(request, response) => {
    console.log("services",services)
    console.log("allb", services.allbusinesses)
    response.json(services.allbusinesses())
})
app.post('/review/:placeId',(request, response) => { 
    let placeid = parseInt(request.params.placeId)
    console.log(request.body)
    let review = request.body.review
    services.addreview(placeid,review)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})


