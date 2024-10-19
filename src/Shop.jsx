import './Shop.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef } from 'react';
function Item(props) {
    return (<div key={props.id} >
        <img src={props.img} width={200} height={200} /><br />
        id: {props.id} <br />
        name: {props.name}<br />
        price: {props.price}<br />
        <button onClick={() => props.callback(props)}> add Cart </button>
        <button onClick={() => props.del_callback(props.id)}> delecte </button>
        <button onClick={() => props.upd_callback(props)}> update </button>
    </div>);
}

export default function Shop() {
    let id;
    const name_ref = useRef(null);
    const price_ref = useRef(null);
    const img_ref = useRef(null);


    const [products, setProducts] = useState([]);
    const URL = "https://special-system-5p996759v7v3vv-5000.app.github.dev";
    useEffect(() => {
        axios.get(URL + '/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.log("error")
            });
    }
        , [])

    // const products = [
    //     { id: 0, name: "Notebook Acer Swift", price: 45900, img: "https://img.advice.co.th/images_nas/pic_product4/A0147295/A0147295_s.jpg" },
    //     { id: 1, name: "Notebook Asus Vivo", price: 19900, img: "https://img.advice.co.th/images_nas/pic_product4/A0146010/A0146010_s.jpg" },
    //     { id: 2, name: "Notebook Lenovo Ideapad", price: 32900, img: "https://img.advice.co.th/images_nas/pic_product4/A0149009/A0149009_s.jpg" },
    //     { id: 3, name: "Notebook MSI Prestige", price: 54900, img: "https://img.advice.co.th/images_nas/pic_product4/A0149954/A0149954_s.jpg" },
    //     { id: 4, name: "Notebook DELL XPS", price: 99900, img: "https://img.advice.co.th/images_nas/pic_product4/A0146335/A0146335_s.jpg" },
    //     { id: 5, name: "Notebook HP Envy", price: 46900, img: "https://img.advice.co.th/images_nas/pic_product4/A0145712/A0145712_s.jpg" }];

    const [cart, setCart] = useState([]);
    function addCart(item) {
        setCart([...cart, { id: item.id, name: item.name, price: item.price, img: item.img }]);
    }
    const clearCart = () => {
        setCart([]);
    }

    const productList = products.map(item => <Item {...item} callback={addCart} del_callback={delProduct} upd_callback={updateProductFrom} />);
    const cartList = cart.map((item, index) => <li>{item.id} {item.name} {item.price}
        <button onClick={() => {
            alert('you click' + index);
            setCart(cart.filter((i, _index) => index != _index));
        }}> Delete </button> </li>);


    let total = 0;

    for (let i = 0; i < cart.length; i++) total += cart[i].price;

    function addProduct() {
        const data = {
            name: name_ref.current.value,
            price: price_ref.current.value,
            img: img_ref.current.value,
        }
        axios.post(URL + "/api/addproduct", data).then((response) => {
            if (response.data.status == "ok") alert("Add product sucessfully");
            setProducts(response.data.products);
        })
        // alert(name_ref.current.value);
    }

    function delProduct(id) {
        // event.stopPropogation
        axios.delete(URL + "/api/delproduct/" + id)
            .then((response) => {
                if (response.data.status == "ok") alert("Delete product sucessfully");
                setProducts(response.data.products);
            })
            .catch(error => {
                console.log("error")
            });
    }

    // function updateProductFrom(item){
    //     id = item.id;
    //     name_ref.current.value = item.name;
    //     price_ref.current.value = item.price;
    //     img_ref.current.value = item.img;
    // }

    // function updateProduct(){
    //     const data = {
    //         name : name_ref.current.value,
    //         price : price_ref.current.value,
    //         img : img_ref.current.value
    //     };
    //     if (!id) alert ("no id")
    //     axios.put(URL+"/api/updateproduct/"+id,data)
    //     .then((response) => {
    //         if(response.data.status=="ok") alert("Update product sucessfully");
    //         setProducts(response.data.products);
    //     })
    //     .catch(error=>{
    //         console.log("error")
    //     });
    // }

    const [productId, setProductId] = useState(null);

    function updateProductFrom(item) {
        setProductId(item.id);
        name_ref.current.value = item.name;
        price_ref.current.value = item.price;
        img_ref.current.value = item.img;
    }

    function updateProduct() {
        if (!productId) return alert("No product id selected");
        const data = {
            name: name_ref.current.value,
            price: price_ref.current.value,
            img: img_ref.current.value
        };
        axios.put(`${URL}/api/updateproduct/${productId}`, data)
            .then((response) => {
                if (response.data.status === "ok") alert("Update product successfully");
                setProducts(response.data.products);
            })
            .catch(error => {
                console.log("error");
            });
    }

    return (<>
        name : <input type='text' ref={name_ref} />
        price : <input type='text' ref={price_ref} />
        img : <input type='text' ref={img_ref} />
        <button onClick={addProduct}>add</button>
        <button onClick={updateProduct}>update</button>

        <div className='grid-container'>{productList}</div>
        <h1>Cart</h1>
        <ol>{cartList}</ol>
        <button onClick={() => clearCart()}>Clear All</button>
        <h2>Total price: {total} bath</h2>
    </>);
}