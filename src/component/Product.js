import { useEffect, useState } from "react";
import { Col, Container, Form, FormCheck, Row, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [search, setSearch] = useState("");
    const [catId, setCatId] = useState(0);
    const [money, setMoney] = useState(0);
    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then(res => res.json())
            .then(result => {

                const allBrands = [];
                result.forEach(product => {
                    if (product.brands && Array.isArray(product.brands)) {
                        product.brands.forEach((brand) => {
                            if (!allBrands.some(b => b.id === brand.id)) {
                                allBrands.push(brand);
                            }
                        });
                    }
                });
                setBrands(allBrands);

            })
    }, []);

    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then(res => res.json())
            .then(result => {
                let productFilter = result;
                if (catId !== 0) {
                    productFilter = productFilter.filter(p => p.category === parseInt(catId));
                }
                if (search.length > 0) {
                    productFilter = productFilter.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
                }
                if (selectedBrands.length > 0) {
                    productFilter = productFilter.filter(p =>
                        selectedBrands.every(sb => p.brands && p.brands.some(pb => pb.id === sb.id))
                    );
                }
                productFilter = productFilter.filter(p => p.price >= money);
                setProducts(productFilter);
            })

        fetch("http://localhost:9999/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));

    }, [catId, search, money, selectedBrands]);

    const handleBrandChange = (brand) => {
        if (selectedBrands.some((brains) => brains.id === brand.id)) {
            setSelectedBrands(prev => prev.filter(br => br.id !== brand.id))
        } else {
            setSelectedBrands(prev => [...prev, brand])
        }
    };

    //handle delete action
    function handleDelete(id) {
        if (window.confirm("Do you want to delete?")) {
            fetch("http://localhost:9999/products/" + id, { method: "DELETE" })
                .then(() => {
                    alert("Delete Success");
                    setProducts(products.filter(product => product.id !== id));
                })
                .catch(error => console.log(error));
        }
    }

    return (
        <Container>
            <Row>
                <Col md={3}>
                    <Container fluid>
                        <Row>
                            <Col><h3>Filter:</h3></Col>
                        </Row>
                        <Row>
                            <Col><h5>By Category</h5></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Select onChange={e => setCatId(parseInt(e.target.value))}>
                                    <option value={0} key={0}>-- All --</option>
                                    {
                                        categories?.map(c => (
                                            <option value={c.id} key={c.id}>{c.name}</option>
                                        ))
                                    }
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col><h5>By Price</h5></Col>
                        </Row>
                        <Row>
                            <Col>Số tiền: {money} VND</Col>
                        </Row>
                        <Row>

                            <Col>
                                <Form.Range min={0} max={100000000} value={money} onChange={e => setMoney(e.target.value)} />
                            </Col>
                        </Row>
                        <Row><Col><h5>By Brands</h5></Col>
                        </Row>
                        <Row>
                            {
                                brands?.map(brand => (
                                    <Form.Check
                                        key={brand.id}
                                        type="checkbox"
                                        label={brand.name}
                                        onChange={() => handleBrandChange(brand)}
                                        checked={selectedBrands.includes(brand)}
                                    />
                                ))
                            }
                        </Row>
                    </Container>
                </Col>
                <Col md={9}>
                    <Container fluid>
                        <Row>
                            <Col><h2>List of Products</h2></Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Control placeholder="Enter product name to search ..."
                                        onChange={e => setSearch(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col style={{ textAlign: "right" }}>
                                <Link to={"/create"} className="btn btn-success">Create new product</Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Table hover bordered striped>
                                    <thead>
                                        <tr>
                                            <th>ID</th><th>Name</th><th>Price</th><th>Description</th>
                                            <th>Brands</th>
                                            <th>Category</th><th>Function</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products?.map(p => (
                                                <tr key={p.id}>
                                                    <td>{p.id}</td>
                                                    <td>
                                                        <Link to={`/product/${p.id}`}>
                                                            {p.name}
                                                        </Link>
                                                    </td>
                                                    <td>{p.price}</td>
                                                    <td>{p.description}</td>
                                                    <td>
                                                        {
                                                            p?.brands?.map(b => {

                                                                return <span key={b.id}>{b?.name}<br /></span>;
                                                            })
                                                        }
                                                    </td>
                                                    <td>
                                                        {categories?.find(c => c.id === p.category)?.name}
                                                    </td>
                                                    <td>
                                                        <Link to={`/product/edit/${p.id}`}>Edit</Link>
                                                    </td>
                                                    <td>
                                                        <Link to='#' onClick={() => handleDelete(p.id)}>Delete</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container >
    );
}
