import React, { Component } from 'react';
import './Filter.css';
import { Checkbox } from './Checkbox';
import _ from 'lodash';

export class Filter extends Component {
    state = { expanded: false };

    handleTagClick(id) {
        const selectedTagIds = this.props.selectedTagIds.slice();
        if (selectedTagIds.includes(id))
            _.pull(selectedTagIds, id);
        else
            selectedTagIds.push(id);

        this.props.changeSelectedTagIds(selectedTagIds);
    }

    clearTags() {
        this.props.changeSelectedTagIds([]);
    }

    render() {
        const tags = this.state.expanded
            ? this.renderExpanded()
            : this.renderCollapsed();

        const expander = this.state.expanded
            ? <span className="text-action" onClick={() => this.setState({ expanded: false })}>Close tag selector</span>
            : <span className="text-action" onClick={() => this.setState({ expanded: true })}>Open tag selector</span>;

        return <div id="filters">
            {tags}
            {expander}
        </div>;
    }

    renderExpanded() {
        const tags = this.props.tags.map((tag, index) => {
            return <tag-select key={index} onClick={() => this.handleTagClick(tag.id)}>
                <Checkbox checked={this.props.selectedTagIds.includes(tag.id)}/>
                {tag.name}
            </tag-select>
        });

        const clearAll = this.props.selectedTagIds.length > 0
            ? <span className="text-action" onClick={() => this.clearTags()}>Clear all</span>
            : null;

        return <span>
            {tags}
            {clearAll}
        </span>;
    }

    renderCollapsed() {
        const selectedTags = this.props.tags
            .filter(tag => this.props.selectedTagIds.includes(tag.id));

        if (selectedTags.length === 0)
            return <span>No tag selected, all restaurants are shown</span>;
            
        return selectedTags.map((tag, index) => {
            return <tag-select key={index}>
                {tag.name}
            </tag-select>
        });
    }
}