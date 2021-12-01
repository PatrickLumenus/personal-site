import { Component } from 'solid-js';

/**
 * UnsubscribeComplete
 * 
 * Shows an unsubscribe message.
 */

const UnsubscribeComplete: Component = () => {

    return (
      <div class="flex bg-white py-24 justify-center">
        <div class="p-12 text-center max-w-2xl">
          <div class="md:text-3xl text-3xl font-bold">
            You Have Successfully Unsubscribed!
          </div>
          <p class="text-xl font-normal mt-4">
            Sorry it didn't work out. I hope we can cross paths again once more
            in the near future.
          </p>
        </div>
      </div>
    );
}

export default UnsubscribeComplete;