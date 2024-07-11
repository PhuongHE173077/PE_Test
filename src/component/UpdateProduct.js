import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

function UpdateProduct() {
    const { pId } = useParams();
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [pName, setPName] = useState("");
    const [pPrice, setPPrice] = useState(0);
    const [pDesc, setPDESC] = useState("");
    const [catId, setCatId] = useState(0);
    const redirect = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:9999/products/${pId}`)
            .then(res => res.json())
            .then(pe => {
                setProduct(pe);
                setPName(pe.name);
                setPPrice(pe.price);
                setPDESC(pe.description);
                setCatId(pe.category);
            })
            .catch(err => console.log(err))
        fetch('http://localhost:9999/categories')
            .then(res => res.json())
            .then(cate => setCategories(cate))
            .catch(err => console.log(err))
    }, [])
    function handleUpdate(e) {
        e.preventDefault();
        fetch(`http://localhost:9999/products/${pId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: pName,
                price: pPrice,
                description: pDesc,
                category: catId
            })
        })
            .then(response => response.json())
            .then(update => {
                alert("Update product Id: " + update.id + " succesfully!")
                redirect("/product");
            })
            .catch(error => console.error('Error:', error))


    }
    const sortedCategories = [...categories].sort((a, b) => {
        if (a.id === product.category) return -1;
        if (b.id === product.category) return 1;
        return 0;
    });
    return (
        <Container>
            <Row>
                <Col>
                    <h3 style={{ textAlign: "center" }}>Update a new Product</h3>
                </Col>
                <hr />
                <Col>
                    <Link to="/product">Back to List</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control defaultValue={product.id} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control defaultValue={product.name} onChange={e => setPName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" defaultValue={product.price} min={0} max={10000000}
                            onChange={e => setPPrice(parseInt(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" defaultValue={product.description} rows={3}
                            onChange={e => setPDESC(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select defaultValue={product.category} onChange={e => setCatId(parseInt(e.target.value))}>
                            {sortedCategories.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Button onClick={handleUpdate}>Update</Button>
                    </Form.Group>
                </Col>
            </Row>

        </Container>
    )
}

export default UpdateProduct;