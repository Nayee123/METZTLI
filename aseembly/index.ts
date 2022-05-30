 import { Product, productsStorage } from './model';
 import { Client, clientsStorage } from './model';
 import { context, ContractPromiseBatch } from "near-sdk-as";



// @Param productID: Is the ID of product that you want to buy
//ProductID: Es el ID del producto que quieres comprar
export function buyProduct(productId: string): void {
    const product = getProduct(productId); //Get the product
    if (product == null) { //Verifica si el producto existe
        throw new Error("Producto No Encontrado o agotado"); //Mensaje de error //Message Error
    }
    if (product.price.toString() != context.attachedDeposit.toString()) { //Verify if the Pay is correct //Verifica si el pago es correcto
        throw new Error("El pago es incorrecto, por favor vuelva a intentar");
    }
    
    ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit); //Transfer the Coins-Nears
    productsStorage.set(product.id, product); 
}

//Method to add a product 
//Método para añadir un producto
// @Param producto: Is a reference of the product to add
export function addProduct(product: Product): void {
    let storedProduct = productsStorage.get(product.id); //Serch the product in the Map 
    if (storedProduct !== null) { //If is different to NULL the product is ready
        throw new Error(`El ID: ${product.id} ya existe en nuestro inventario`); //Message
    } 
    productsStorage.set(product.id, Product.fromPayload(product)); //Will add the Producto to the Map of products
}
//Este metodo sirve para obtener todos los productos 
export function getAllProducts(): Array<Product> {
    return productsStorage.values(); //Devuelve sus valores - en el frente inyectaremos los valores.
}

// @Param ID: Es el ID del producto a buscar 
export function getProduct(id: string): Product | null {
    return productsStorage.get(id);
}

//Este es el metodo de clientes 
// @Param ID: Es el ID del cliente a buscar 
export function getClient(id: string): Product | null {
    return clientsStorage.get(id);
}

//Metodo para agregar a los clientes 
export function addClient(client: Client): void {
    let storedClient = clientsStorage.get(client.id); //Busca a un cliente en el mapa 
    if (storedClient !== null) { //Si es diferentes a NULL el Clent esta listo
        throw new Error(`El ID: ${client.id} ya existe en nuestro inventario`); //mMuestra el mensaje 
    } 
    productsStorage.set(client.id,Client.loadClient(client)); //Se agrega el producto al mapa de productos 
}
