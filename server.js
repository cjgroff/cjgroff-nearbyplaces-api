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
//app.get('/test',(request, response) => {
//    services.allbusinesses2(response)
//  })
  
app.get('/search/:searchTerm/:location',(request, response) => {
    ///search/chi/tucson,az
    const term = request.params.searchTerm
    const [city,state] = request.params.location.split(",")
    console.log("TCS",term,city,state)
    services.findbusinesses(response,term,city,state)
})
app.post('/place', (request, response) => {
    console.log("place:", request.body)
    if (request.body.update){
        services.updatebusiness(response,request.body)

    }
    else {
        services.addbusiness(response,request.body)  
    }
    
    //console.log("Update scores:", scores)
    //response.json({message: 'Place update'})

})

app.get('/places',(request, response) => {
    console.log("services",services)
    console.log("allb", services.allbusinesses)
    services.allbusinesses(response)

})
app.post('/review/:placeId',(request, response) => { 
    let placeid = parseInt(request.params.placeId)
    console.log(request.body)
    let review = request.body.review
    services.addreview(response,placeid,review)
})
app.delete('/place/:placeId',(request, response) => {
    let placeid = parseInt(request.params.placeId)
    console.log("Deleting",placeid)
    services.deletebusiness(response,placeid)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})


