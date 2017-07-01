import React from 'react';
import './ContextMenu.css';
import 'font-awesome/css/font-awesome.css';

export default class ContextMenu extends React.Component {

  menuItems() {
    return [];
  }

  render() {
    return (
      <div className="menu">
        {this.menuItems().map((item, key) => {
          if (item.canRender()) {
            const clickHandler = item.clickHandler ? item.clickHandler : null;

            return (
              <button key={key} onClick={clickHandler}>
                {item.render()}
              </button>
            );
          }
          return null;
        })}
      </div>
    );
  }
}