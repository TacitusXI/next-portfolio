/**
 * Analytics utilities for tracking user behavior
 */
import Clarity from '@microsoft/clarity';

/**
 * Track a custom event in Clarity
 * @param eventName Name of the event to track
 */
export const trackEvent = (eventName: string): void => {
  try {
    Clarity.event(eventName);
    console.log(`Analytics event tracked: ${eventName}`);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

/**
 * Add custom tags to the current Clarity session
 * @param key Tag key
 * @param value Tag value or array of values
 */
export const setTag = (key: string, value: string | string[]): void => {
  try {
    Clarity.setTag(key, value);
    console.log(`Analytics tag set: ${key} = ${value}`);
  } catch (error) {
    console.error('Failed to set tag:', error);
  }
};

/**
 * Identify the current user for Clarity tracking
 * @param userId Unique identifier for the user
 * @param sessionId Optional custom session id
 * @param pageId Optional custom page id
 * @param friendlyName Optional friendly name for the user
 */
export const identifyUser = (
  userId: string,
  sessionId?: string,
  pageId?: string,
  friendlyName?: string
): void => {
  try {
    Clarity.identify(userId, sessionId, pageId, friendlyName);
    console.log(`User identified: ${userId}`);
  } catch (error) {
    console.error('Failed to identify user:', error);
  }
};

/**
 * Upgrade the current Clarity session to prioritize recording
 * @param reason Reason for upgrading the session
 */
export const upgradeSession = (reason: string): void => {
  try {
    Clarity.upgrade(reason);
    console.log(`Session upgraded: ${reason}`);
  } catch (error) {
    console.error('Failed to upgrade session:', error);
  }
}; 