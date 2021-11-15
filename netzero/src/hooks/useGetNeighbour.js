import {useState, useEffect} from 'react'
import firebase from '../firebase'

const useGetNeighbour = (id) => {
   
    const [docs, setdocs] = useState([])

    useEffect(() => {
         firebase.firestore().collection("neighbourhood").doc(id).onSnapshot((doc)=>{
            console.log(doc.docs)
            setdocs("")
         })
    }, [])
    return {docs}
}

export default useGetNeighbour
