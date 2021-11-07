import {useState, useEffect} from 'react'
import firebase from '../firebase'


const Transport = (id) => {
    const [docs, setdocs] = useState([])

       firebase.firestore().collection("blocks").where("block_id","==", id).onSnapshot((doc)=>{
            const neighbourhood = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
            setdocs(neighbourhood)
         })
    
    return {docs}
}

export default Transport
