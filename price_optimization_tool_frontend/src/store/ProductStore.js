import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import notification from "./NotificationStore";
class ProductStore {
  products = [];
  pricingOptimizeProducts = [];
  ForecastEnabled = false;
  categoryList=[]

  constructor() {
    makeAutoObservable(this);
  }

  fetchPriceOptimizationRecords() {
    axios.get('/pricing/pricing-optimization/').then(res => {
      runInAction(() => {
        this.pricingOptimizeProducts = res.data
        this.fetchCategoryList(res.data)
      })
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Record Fetch Failed!'
      })
    })
  }
  fetchProducts() {
    axios.get('/products/products/').then(res => {
      runInAction(() => {
        this.products = res.data
        this.fetchCategoryList(res.data)
      })
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Record Fetch Failed!'
      })
    })
  }

  fetchCategoryList(data){
    var uniqueCategoryList = new Set()
    data.forEach((el)=>{
      uniqueCategoryList.add(el.category)
    })
    runInAction(() => {
    this.categoryList=[...uniqueCategoryList]
    }
  )
  }

  addProduct(product) {
    axios.post('/products/products/', product).then(res => {
      runInAction(() => {
        this.products = [...this.products, { id: res.data.id, ...product }]
      })
      notification.addNotification({
        open: true,
        message: 'Record Added Successfully!'
      })
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Record Addition Failed!'
      })
    })
  }

  updateProduct(updatedProduct) {
    axios.put(`/products/products/${updatedProduct.id}/`, updatedProduct).then(res => {
      runInAction(() => {
        this.products = this.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
      })
      notification.addNotification({
        open: true,
        message: 'Record Updated Successfully!'
      })
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Record Updation Failed!'
      })
    })
  }

  deleteProduct(id) {
    axios.delete(`/products/products/${id}`).then(res => {
      runInAction(() => {
        this.products = this.products.filter((product) => product.id !== id);
      })
      notification.addNotification({
        open: true,
        message: 'Record Deleted Successfully!'
      })
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Record Deletion Failed!'
      })
    })
  }

  filteredProducts(searchText, selectedCategory, type) {
    var productList = type === 'products' ? this.products : this.pricingOptimizeProducts
    return productList?.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}

export const productStore = new ProductStore();
