export default defineAppConfig({
    ui: {
        button: {
            defaultVariants: {
                variant: 'outline',
                color: 'neutral',
            },
            compoundVariants: [
                {
                    color: 'neutral',
                    variant: 'outline',
                    class: 'cursor-pointer flex justify-center text-black-500 px-12 py-3 my-7 border-1 border-black hover:bg-secondary-100 active:shadow-[0px_0px_0_rgba(0,0,0)] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                },
            ],
        },
    }
});
