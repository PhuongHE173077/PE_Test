import { useEffect, useState } from 'react'
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import '../css/create.css';


export default function CreateProduct() {
    const redirect = useNavigate();
    const [categories, setCategories] = useState([]);
    const [pName, setPName] = useState("");
    const [pPrice, setPPrice] = useState(0);
    const [pDesc, setPDESC] = useState("");
    const [catId, setCatId] = useState("0");

    useEffect(() => {
        // GET - URI: http://localhost:9999/categories
        fetch("http://localhost:9999/categories")
            .then(res => res.json())
            .then(result => setCategories(result))
            .catch(error => console.log(error));
    }, []);

    function handleCreate(e) {
        // Prevent page reload on button click
        e.preventDefault();

        // Form input validation
        let message = "";
        let status = true;

        if (pName.length === 0) {
            message += "Product name is required.\n";
            status = false;
        }
        if (catId === "0") {
            message += "You must choose a category.";
            status = false;
        }

        if (!status) {
            alert(message);
        } else {
            const newProduct = {
                name: pName,
                price: pPrice,
                description: pDesc,
                category: catId
            };

            fetch("http://localhost:9999/products", {
                method: "POST",
                body: JSON.stringify(newProduct),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(resp => resp.json())
                .then(productCreated => {
                    alert("Create success! Id: " + productCreated.id);
                    redirect("/product");
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h3 style={{ textAlign: "center" }}>Create a new Product</h3>
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
                        <Form.Control disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control onChange={e => setPName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" min={0} max={10000000}
                            onChange={e => setPPrice(parseInt(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3}
                            onChange={e => setPDESC(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select onChange={e => setCatId(e.target.value)}>
                            <option value="0">-- Select a category</option>
                            {categories?.map(c => (
                                <option value={c.id} key={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Button onClick={handleCreate}>Create</Button>
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}
