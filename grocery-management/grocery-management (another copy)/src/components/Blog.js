import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const blogPosts = [
    {
        id: 1,
        title: 'The Future of E-Commerce',
        excerpt: 'Explore the trends and technologies shaping the future of online shopping.',
        imageUrl: 'https://dummyimage.com/600x400/000/fff.png',
        link: '#'
    },
    {
        id: 2,
        title: 'How to Improve Customer Experience',
        excerpt: 'Discover strategies to enhance your customers\' shopping experience.',
        imageUrl: 'https://dummyimage.com/600x400/000/fff.png',
        link: '#'
    },
    {
        id: 3,
        title: 'Top 10 Digital Marketing Strategies',
        excerpt: 'Learn about the most effective digital marketing tactics for 2024.',
        imageUrl: 'https://dummyimage.com/600x400/000/fff.png',
        link: '#'
    },
    {
        id: 4,
        title: 'The Role of AI in Modern Retail',
        excerpt: 'Understand how artificial intelligence is transforming the retail industry.',
        imageUrl: 'https://dummyimage.com/600x400/000/fff.png',
        link: '#'
    }
];

function Blogs() {
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Our Latest Blogs</h1>
            <Row className="g-4">
                {blogPosts.map((post) => (
                    <Col md={6} lg={4} key={post.id}>
                        <Card className="shadow-sm">
                            <Card.Img
                                variant="top"
                                src={post.imageUrl}
                                alt={post.title}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.excerpt}</Card.Text>
                                <Button variant="primary" href={post.link}>
                                    Read More
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Blogs;
