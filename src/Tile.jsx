import PropTypes from 'prop-types';

function Tile({ value, cellKey }) {
    return (<> 
        <div className={value !== 0 ? "grid-cell grid-cell-full" : "grid-cell grid-cell-empty"} key={cellKey}>
            {value !== 0 ? value : ''}
        </div>
    </>);
}

 Tile.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    cellKey: PropTypes.string.isRequired
};

export default Tile;