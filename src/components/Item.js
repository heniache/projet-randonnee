import "../styles/Item.css";
function Item(props) {
  return (
    <div className="item-content">
      <a href={`/detail/${props.id}`} className="item-image-link">
        <img className="item-cover" src={props.cover} alt={props.name} />
      </a>
      <div className="item-info">
        <p className="item-name">{props.name}</p>
        <p className="item-meta">Taille : {props.size}</p>
        <p className="item-meta">Confort : {props.comfort}</p>
        <p className="item-price">{props.price} €</p>
      </div>
    </div>
  );
}
export default Item;
