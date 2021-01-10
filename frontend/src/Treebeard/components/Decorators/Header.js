import React from 'react';
import PropTypes from 'prop-types';

import {Div} from '../common';

const Header = ({onSelect, node, style, customStyles}) => (
    <div style={style.base} onClick={onSelect}>
        {node.type==="file"?(
            <Div style= {{lineHeight: '24px',verticalAlign: 'middle',color:"grey"}}>
                &nbsp;&nbsp;{node.name}
            </Div>
        ):(<Div style= {{lineHeight: '24px',verticalAlign: 'middle',color:"black"}}>
            {node.name}
        </Div>)}
    </div>
);

Header.propTypes = {
    onSelect: PropTypes.func,
    style: PropTypes.object,
    customStyles: PropTypes.object,
    node: PropTypes.object.isRequired
};

Header.defaultProps = {
    customStyles: {}
};

export default Header;
