import { createTestSyncPair } from './testUtils';

// Ensures legacy detail actions map correctly into metadata.detail

test('legacy detail action mapping (tab-change)', async () => {
  const { agent, customer, drain } = createTestSyncPair();
  // Simulate legacy call: detailAction with type 'tab-change' (old naming)
  agent.detailAction({ type: 'tab-change', tab: 'overview' });
  await drain();

  const metaAgent = agent.getState().metadata.detail;
  const metaCustomer = customer.getState().metadata.detail;

  expect(metaAgent).toBeDefined();
  expect(metaCustomer).toBeDefined();
  expect(metaAgent.type).toBe('tab-change');
  expect(metaCustomer.type).toBe('tab-change');
  expect(metaCustomer.tab).toBe('overview');
});
