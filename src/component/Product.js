import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";

export default function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [catId, setCatId] = useState("all");
    const [money, setMoney] = useState(0);

    useEffect(() => {
        // GET - URI: http://localhost:9999/products
        fetch("http://localhost:9999/products")
            .then(res => res.json())
            .then(result => {
                if (catId !== "all") {
                    if (money > 0) {
                        if (search.length > 0)
                            setProducts(result.filter(p => p.category === catId && p.name.toLowerCase().includes(search.toLowerCase()) && p.price >= money))
                        else
                            setProducts(result.filter(p => p.category === catId && p.price >= money))
                    } else {
                        if (search.length > 0)
                            setProducts(result.filter(p => p.category === catId && p.name.toLowerCase().includes(search.toLowerCase())))
                        else
                            setProducts(result.filter(p => p.category === catId))
                    }

                }
                else {
                    if (money > 0) {
                        if (search.length > 0)
                            setProducts(result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && p.price >= money))
                        else
                            setProducts(result.filter(p => p.price >= money))
                    } else {
                        if (search.length > 0)
                            setProducts(result.filter(p => p.name.toLowerCase().includes(search.toLowerCase())))
                        else
                            setProducts(result)
                    }
                }

            })
            .catch(error => console.log(error));

        // GET - URI: http://localhost:9999/categories
        fetch("http://localhost:9999/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));

    }, [catId, search, money]);

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
                                <Form.Select onChange={e => setCatId(e.target.value)}>
                                    <option value="all" key={0}>-- All --</option>
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
                            <Col></Col>
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
                                                            p.brands?.map(b => {
                                                                return <span key={b.id}>{b.name}<br /></span>
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
        </Container>
    );
}
