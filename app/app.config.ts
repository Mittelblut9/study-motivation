export default defineAppConfig({
    ui: {
        button: {
            defaultVariants: {
                variant: 'outline',
                color: 'neutral',
            },
            slots: {
                base: 'cursor-pointer',
            },
            compoundVariants: [
                {
                    color: 'neutral',
                    variant: 'outline',
                    class: 'cursor-pointer flex justify-center px-12 py-3 my-7 border-1 border-black hover:bg-secondary-100 active:shadow-[0px_0px_0_rgba(0,0,0)] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                },
            ],
        },
        navigationMenu: {
            slots: {
                linkLabel: 'text-black',
                linkLeadingIcon: 'text-black!',
            }
        },
        inputTags: {
            slots: {
                root: 'w-[400px]',
            }
        }
    }
});
