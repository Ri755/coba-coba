//install axios: npm i axios

const axios=require("axios");


const BASE_URL = "https://reqres.in/api/users";

const fetchapi =async (req, res) => {
    try {
        //kalau mau panjang bisa seperti itu
        //const response = await axios.get("https://reqres.in/api/users?page=2");
        const response = await axios.get(BASE_URL+"?page=1");

        return res.status(200).json({
            message: "Data berhasil ditarik",
            //kalau cuma data: response.data-> hasilnya hanya akan ditampilkan data di halaman pertama saja.
            //data: response.data.data,-> langsung ambil bagian json datanya saja, yang page, per page, total, total page tidak ada.
            //data: response.data.data[1]-> langsung ditampilkan data yang kedua karena datanya sebagai array.
            //data: response.data.data.email,-> ini tidak akan bisa ambil datanya.
            data: response.data.data,
        })
        
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    };
};

const singleData =async (req, res) => {
    try {
        const response = await axios.get(BASE_URL, { timeout: 5000 });

        //hati-hati karena mesti ambil datanya dengan response.data.data ya. kalau cuma response.data, hanya mendapatkan semua isi normal dari jasonnya
        const data=response.data.data;

        //console.log(response.data);
        if (data.length >0){
            const dataPertama=data[0];
            const kalimat = `Data pertama ini adalah ${dataPertama.email} dengan id ${dataPertama.id}`;
            //console.log(kalimat);
            return res.status(200).json({
                message: "Data berhasil ditarik",
                //kalau cuma data: response.data-> hasilnya hanya akan ditampilkan data di halaman pertama saja.
                //data: response.data.data,-> langsung ambil bagian json datanya saja, yang page, per page, total, total page tidak ada.
                //data: response.data.data[1]-> langsung ditampilkan data yang kedua karena datanya sebagai array.
                //data: response.data.data.email,-> ini tidak akan bisa ambil datanya.
                data: response.data.data[0],
                kalimat: kalimat,
            })
        }
        else{
            console.log("data kosong");
        }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    };
};

const postData = async (req,res) =>{
    try {
        const data=req.body;
        const dataTampil={
            nama: data.name,
            job: data.job,
        }
        // const data={
        //     name: "morpheus",
        //     job: "leader"
        // }
        const response=await axios.post(BASE_URL, dataTampil);
        
        ////bisa ditulis dengan cara seperti ini atau dengan cara yang ada di atas.
        // const response =await axios({
        //     method: 'post',
        //     url: BASE_URL,
        //     data: {
        //         name: "morpheus",
        //         job: "leader"
        //     }
        // })

        return res.status(201).json({
            message: "Data berhasil ditarik",
            data: response.data,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateData = async (req,res) =>{
    try {
        const id=req.params.id;

        const data=req.body;
        const dataTampil={
            nama: data.name,
            job: data.job,
        }
        const response=await axios.put(BASE_URL+"/"+id, dataTampil);

        return res.status(200).json({
            message: "Data berhasil update",
            data: response.data,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteData = async (req,res) =>{
    try {
        const id=req.params.id;

        // if (!id) {
        //     return res.status(400).json({ message: "ID tidak boleh kosong!" });
        // }
        
        const response=await axios.delete(BASE_URL+"/"+id);
        //console.log("https://reqres.in/api/users/"+id);
        
        //klo statusnya 204 berarti tidak ada kontentnya
        return res.status(200).json({
            message: "Data berhasil dihapus",
            data: response.data,
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const queryAnime = async (req, res) => {
    const perintah = await axios.get("https://api.jikan.moe/v4/anime", {
        params: req.query,
        //isi req.query -> q="conan" , limit="3"
    });
    
    //Mengambil data JSON dari response Axios
    const hasilPerintah = perintah.data;
    console.log("Hasil hasilPerintah"+ hasilPerintah);
    
    //Mengambil hanya bagian "data" dari response API
    const data = hasilPerintah.data;
    console.log("Hasil data"+ data);
    //const result=data;

    //data.map untuk memformat ulang data yang didapat dari API
    const result = data.map((item) => {
        const ret = {
            mal_id: item.mal_id,
            url: item.url,
            title: item.title,
            trailer: item.trailer.url,
            type: item.type,
            episodes: item.episodes,
            status: item.status,
            rating: item.rating,
        };
        return ret;
    });

    return res.status(200).json(result);
};

const productApi =async (req, res) =>{
    const products = [
        {id:1, name:"sabun", price: 1000, currency:"IDR"},
        {id:2, name:"hp", price: 150, currency:"USD"},
     ]
 
     const currency = (req.query.currency || "IDR").toUpperCase();
     const product = products.find((p) => p.id == req.params.id);
     console.log(product.currency);
 
     if(currency == product.currency){
          return res.status(200).send(product);
     }
     else{
          const response = await axios(`https://open.er-api.com/v6/latest/${product.currency}`);
          const data = response.data;
          //console.log(data);
          console.log(data["rates"][currency]);
          return res.status(200).json({
             message: "Data berhasil di convert",
             id:product.id,
             name:product.name,
             price: product.price * data["rates"][currency],
             currency: currency
          });
     };
};

module.exports={
    fetchapi,
    singleData,
    postData,
    updateData,
    deleteData,
    queryAnime,
    productApi,
}