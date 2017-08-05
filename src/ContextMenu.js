import React from 'react';
import './ContextMenu.css';
import 'font-awesome/css/font-awesome.css';

export default class ContextMenu extends React.Component {

  menuItems() {
    return [];
  }

  render() {
    const { canSync, isMenuEnabled } = this.props;

    return (
      <div className="menu">
        {this.menuItems().map((item, key) => {
          if (item.canRender()) {
            const clickHandler = item.clickHandler ? item.clickHandler : null;

            const disabled = () => {
              if(!isMenuEnabled) {
                return true;
              }
              else if (item.isEnabled) {
                return item.isEnabled(canSync);
              }
              return false;
            };

            return (
              <button disabled={disabled()} key={key} onClick={clickHandler}>
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