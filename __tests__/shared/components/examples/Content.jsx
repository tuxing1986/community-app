import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router-dom';

import Content from 'components/examples/Content';

test('matches snapshots', () => {
  const cmp = renderer.create(
    <StaticRouter context={{}}>
      <Content />
    </StaticRouter>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});