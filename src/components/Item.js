import "../styles/Item.css";
function Item(props) {
  const idValue = props.id;
  const coverValue = props.cover;
  const nameValue = props.name;
  const sizeValue = props.size;
  const comfortValue = props.comfort;
  const prix = props.price;
  return (
    <div>
      <a href={`/detail/${idValue}`}>
        <img className="item-cover" src={coverValue} alt={nameValue} />
        <br />
      </a>
      {nameValue}
      <br />
      Taille : {sizeValue}
      <br />
      Confort : {comfortValue}
      <br />
      Prix : {prix}
    </div>
  );
}
export default Item;
