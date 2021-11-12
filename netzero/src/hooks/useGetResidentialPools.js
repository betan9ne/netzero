import {useState, useEffect} from 'react'
import firebase from '../firebase'


const useGetResidentialPools = () => {
    const [docs, setdocs] = useState([])

    useEffect(() => {
         firebase.firestore().collection("neighbourhood").onSnapshot((doc)=>{
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
    }, [])
    return {docs}
}

export default useGetResidentialPools
