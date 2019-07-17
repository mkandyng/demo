import React from "react";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import PropTypes from 'prop-types';

/**
 *
 * SelectableTabs is a generic widget to generate react-tabs
 * that is selectable and invoke onSelect callback
 *
 */
export default function SelectableTabs({
  containerId,
  selectedTab,
  updateSelectedTab,
  tabs
}) {
  return (<div id={containerId}>
    <Tabs selectedIndex={selectedTab} onSelect={tabIndex => updateSelectedTab(tabIndex)}>
      <TabList>
        {tabs.map(tab => <Tab key={tab.name}>{tab.name}</Tab>)}
      </TabList>
      {tabs.map(tab => <TabPanel key={tab.name}>{tab.panel}</TabPanel>)}
    </Tabs>
  </div>);
}

SelectableTabs.propTypes = {
  containerId: PropTypes.string.isRequired,
  selectedTab: PropTypes.number.isRequired,
  updateSelectedTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.object)
};
