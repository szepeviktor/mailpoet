import React from 'react';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from '@wordpress/components';

import { getBlockType } from '@wordpress/blocks';
import { withSelect } from '@wordpress/data';

const SidePanel = ({
  /* eslint-disable react/prop-types */
  count,
  selectedBlockClientId,
  selectedBlockName,
  /* eslint-enable react/prop-types */
}) => (
  <Panel>
    <PanelHeader label="Test Interaction">{selectedBlockClientId ? 'Block selected' : 'Select block'}</PanelHeader>
    <PanelBody title={selectedBlockName}>
      <p>{count}</p>
    </PanelBody>
  </Panel>
);


export default withSelect(
  (select) => {
    const { getSelectedBlockClientId, getSelectedBlockCount, getBlockName } = select('core/block-editor');
    const selectedBlockClientId = getSelectedBlockClientId();
    const selectedBlockName = selectedBlockClientId && getBlockName(selectedBlockClientId);
    const blockType = selectedBlockClientId && getBlockType(selectedBlockName);
    return {
      count: getSelectedBlockCount(),
      selectedBlockName,
      selectedBlockClientId,
      blockType,
    };
  }
)(SidePanel);
