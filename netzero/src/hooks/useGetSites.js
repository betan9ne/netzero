import {useState, useEffect} from 'react'
import firebase from '../firebase'

const useGetSites = (id) => {
    const [docs, setdocs] = useState([])

    useEffect(() => {
         firebase.firestore().collection("sites").where("block_id","==", id).onSnapshot((doc)=>{
            const neighbourhood = [];
            doc.docs.forEach(document => {
              const nb = {
                id: document.id,
                ...document.data()
              }
              neighbourhood.push(nb)
            })
            function SortArray(x, y){
              if (x.model < y.model) {return -1;}
              if (x.model > y.model) {return 1;}
              return 0;
          }
          var s = neighbourhood.sort(SortArray);
            setdocs(s)
         })
    }, [])
    return {docs}
}


export default useGetSites
