import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export default function Cards(props) {
  return (
    <Card style={{ width: '18rem' }}> {/* You can also use custom classes here */}
      <Card.Img variant="top" src={props.image} alt={props.title} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        {/* You can include more card content here like description or text */}
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </Card.Text> */}
        {/* Including a button for action, if needed */}
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}
