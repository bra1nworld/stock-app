import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
import SiderLayout from "../imports/ui/SiderLayout";

Meteor.startup(() => {
    render(<SiderLayout />, mountNode);
});
