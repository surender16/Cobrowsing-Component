import { createTestSyncPair } from './testUtils';

// Test that PAYMENT_STEP detail action propagates from agent to customer

test('payment step metadata sync', async () => {
  const { agent, customer, drain } = createTestSyncPair();
  agent.detailAction({ type: 'PAYMENT_STEP', step: 'review' });
  await drain();

  expect(customer.getState().metadata.paymentStep).toBe('review');

  // Change step
  agent.detailAction({ type: 'PAYMENT_STEP', step: 'confirm' });
  await drain();
  expect(customer.getState().metadata.paymentStep).toBe('confirm');
});
