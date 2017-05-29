import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/Header';
import FRBCatTXT from './components/FRBCatTXT';
import ProductList from './components/ProductList';
import * as productService from './services/product-service';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            min: 0,
            max: 30,
            products: [],
            total: 0,
            page: 1
        }
    }

    componentDidMount() {
        this.findProducts();
    }

    searchKeyChangeHandler(searchKey) {
        this.setState({searchKey: searchKey, page: 1}, this.findProducts);
    }

    rangeChangeHandler(values) {
        this.setState({min: values[0], max: values[1], page: 1}, this.findProducts);
    }

    findProducts() {
        productService.findAll({search: this.state.searchKey, min: this.state.min, max: this.state.max, page: this.state.page})
            .then(data => {
                this.setState({
                    products: data.products,
                    page: data.page,
                    pageSize: data.pageSize,
                    total: data.total
                });
            });
    }

    nextPageHandler() {
        let p = this.state.page + 1;
        this.setState({page: p}, this.findProducts);
    }

    prevPageHandler() {
        let p = this.state.page - 1;
        this.setState({page: p}, this.findProducts);
    }

    render() {
        return (
            <div>
                <Header text="FRB Catalogue"/>
                <FRBCatTXT/>
                <ProductList products={this.state.products} total={this.state.total} onSearchKeyChange={this.searchKeyChangeHandler.bind(this)}/>
            </div>
        );
    }
};

ReactDOM.render(<App/>, document.getElementById("main"));
