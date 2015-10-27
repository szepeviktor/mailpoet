import React from 'react'
import { Router, Route, Link } from 'react-router'

import jQuery from 'jquery'
import MailPoet from 'mailpoet'
import classNames from 'classnames'

import Listing from 'listing/listing.jsx'

var columns = [
  {
    name: 'name',
    label: 'Name',
    sortable: true
  },
  {
    name: 'description',
    label: 'Description',
    sortable: false
  },
  {
    name: 'subscribed',
    label: 'Subscribed',
    sortable: false
  },
  {
    name: 'unconfirmed',
    label: 'Unconfirmed',
    sortable: false
  },
  {
    name: 'unsubscribed',
    label: 'Unsubscribed',
    sortable: false
  },
  {
    name: 'created_at',
    label: 'Created on',
    sortable: true
  }
];

var messages = {
  onDelete: function(response) {
    var count = ~~response.segments;
    var message = null;

    if(count === 1 || response === true) {
      message = (
        '1 segment was moved to the trash.'
      );
    } else if(count > 1) {
      message = (
        '%$1d segments were moved to the trash.'
      ).replace('%$1d', count);
    }

    if(message !== null) {
      MailPoet.Notice.success(message);
    }
  },
  onConfirmDelete: function(response) {
    var count = ~~response.segments;
    var message = null;

    if(count === 1 || response === true) {
      message = (
        '1 segment was permanently deleted.'
      );
    } else if(count > 1) {
      message = (
        '%$1d segments were permanently deleted.'
      ).replace('%$1d', count);
    }

    if(message !== null) {
      MailPoet.Notice.success(message);
    }
  },
  onRestore: function(response) {
    var count = ~~response.segments;
    var message = null;

    if(count === 1 || response === true) {
      message = (
        '1 segment has been restored from the trash.'
      );
    } else if(count > 1) {
      message = (
        '%$1d segments have been restored from the trash.'
      ).replace('%$1d', count);
    }

    if(message !== null) {
      MailPoet.Notice.success(message);
    }
  }
};

var item_actions = [
  {
    name: 'edit',
    link: function(item) {
      return (
        <Link to={ `/edit/${item.id}` }>Edit</Link>
      );
    }
  },
  {
    name: 'duplicate_segment',
    refresh: true,
    link: function(item) {
      return (
        <a
          href="javascript:;"
          onClick={ this.onDuplicate.bind(null, item) }
        >Duplicate</a>
      );
    },
    onDuplicate: function(item) {
      MailPoet.Ajax.post({
        endpoint: 'segments',
        action: 'duplicate',
        data: item.id
      }).done(function() {
        MailPoet.Notice.success(
          ('List "%$1s" has been duplicated.').replace('%$1s', item.name)
        );
      });
    }
  },
  {
    name: 'view_subscribers',
    link: function(item) {
      return (
        <a href={ item.subscribers_url }>View subscribers</a>
      );
    }
  }
];

var bulk_actions = [
  {
    name: 'trash',
    label: 'Trash',
    getData: function() {
      return {
        confirm: false
      }
    },
    onSuccess: messages.onDelete
  }
];

var SegmentList = React.createClass({
  renderItem: function(segment, actions) {
    var rowClasses = classNames(
      'manage-column',
      'column-primary',
      'has-row-actions'
    );

    return (
      <div>
        <td className={ rowClasses }>
          <strong>
            <a>{ segment.name }</a>
          </strong>
          { actions }
        </td>
        <td className="column-date" data-colname="Description">
          <abbr>{ segment.description }</abbr>
        </td>
        <td className="column-date" data-colname="Subscribed">
          <abbr>{ segment.subscribed || 0 }</abbr>
        </td>
        <td className="column-date" data-colname="Unconfirmed">
          <abbr>{ segment.unconfirmed || 0 }</abbr>
        </td>
        <td className="column-date" data-colname="Unsubscribed">
          <abbr>{ segment.unsubscribed || 0 }</abbr>
        </td>
        <td className="column-date" data-colname="Created on">
          <abbr>{ segment.created_at }</abbr>
        </td>
      </div>
    );
  },
  render: function() {
    return (
      <div>
        <h2 className="title">
          Segments <Link className="add-new-h2" to="/new">New</Link>
        </h2>

        <Listing
          location={ this.props.location }
          params={ this.props.params }
          messages={ messages }
          search={ false }
          limit={ 1000 }
          endpoint="segments"
          onRenderItem={ this.renderItem }
          columns={ columns }
          bulk_actions={ bulk_actions }
          item_actions={ item_actions }
        />
      </div>
    );
  }
});

module.exports = SegmentList;