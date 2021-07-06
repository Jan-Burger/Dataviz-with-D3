import React from "react";
import {Tag, Input, Modal} from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';

class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };
  // Modal function which is triggered when
   tagsInfo = (titleAndContent) => {
      Modal.info({
        title: titleAndContent[0],
        content: (
          <div>
            <p>{titleAndContent[1]}</p>
          </div>
        ),
        onOk() {},
      });
    }

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
    // Update raw Data when tag is removed
    this.props.onTagRemove(removedTag);
    this.props.deleteTSFromLegend(removedTag);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleRemoveTagIfInvalidTS = stockSymbol => {
      let tags
  }

  handleInputConfirm = () => {
      // TODO: Double appearing modal form ant design & correct verification of legend and too many stocks selected
    const {inputValue} = this.state;
    let {tags} = this.state;



    if (inputValue && tags.indexOf(inputValue) === -1) {
        console.log("Value ok...")
        if (tags.length < 3){
            this.props.updateLegend(inputValue, tags);
        }

        tags = [...tags, inputValue];

      if ((tags.length > 3)) {
          console.log("Pop up will be shown in next line...")
        this.tagsInfo(['Too many Stocks selected', "You are trying to select too many stocks than allowed in the free version. If you want to select an infinite amount of stocks sign up for the premium version."])
      }else {
          console.log(inputValue);
          if (inputValue.length > 0){
            this.props.fetchstockdata(inputValue);
          }

        }
        if(tags.length < 4){
          console.log(tags);
          this.setState({
          tags,
          inputVisible: false,
          inputValue: '',
          });
        }
      }else {
          console.log(tags);
          this.setState({
          tags,
          inputVisible: false,
          inputValue: '',
          });
    }


  };

  saveInputRef = input => {
    this.input = input;
  };

  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const tagChild = tags.map(this.forMap);
    return (
      <>
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput} className="site-tag-plus">
            <PlusOutlined /> Add Stock
          </Tag>
        )}
      </>
    );
  }
}

export default EditableTagGroup;
